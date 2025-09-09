import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { createSmsService } from '../services/smsAdapter.js'

const router = Router()

// Middleware to verify manage token
const verifyManageToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.params.token || req.body.token
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token נדרש'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.type !== 'manage') {
      return res.status(401).json({
        success: false,
        message: 'Token לא תקין'
      })
    }

    // Check if token exists in database and is not used
    const manageToken = await req.prisma.manageToken.findUnique({
      where: { token },
      include: {
        booking: {
          include: {
            salon: true,
            service: true,
            customer: true
          }
        }
      }
    })

    if (!manageToken || manageToken.isUsed || manageToken.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Token לא תקין או פג תוקף'
      })
    }

    req.booking = manageToken.booking
    req.manageToken = manageToken
    next()
  } catch (error) {
    console.error('Verify manage token error:', error)
    res.status(401).json({
      success: false,
      message: 'Token לא תקין'
    })
  }
}

// Get booking details for management
router.get('/:token', verifyManageToken, async (req, res) => {
  try {
    const { booking } = req
    
    res.json({
      success: true,
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        totalPrice: booking.totalPrice,
        salon: {
          name: booking.salon.name,
          address: booking.salon.address,
          phone: booking.salon.phone
        },
        service: {
          name: booking.service.name,
          duration: booking.service.duration
        },
        customer: {
          name: booking.customer.name,
          phone: booking.customer.phone
        }
      }
    })
  } catch (error) {
    console.error('Get booking details error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת פרטי ההזמנה'
    })
  }
})

// Cancel booking
router.post('/:token/cancel', verifyManageToken, async (req, res) => {
  try {
    const { booking, manageToken } = req
    
    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'ההזמנה כבר בוטלה'
      })
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'לא ניתן לבטל הזמנה שהושלמה'
      })
    }

    // Update booking status
    await req.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' }
    })

    // Mark manage token as used
    await req.prisma.manageToken.update({
      where: { id: manageToken.id },
      data: { isUsed: true }
    })

    // Send cancellation SMS
    const smsService = createSmsService(req.prisma)
    const dateTime = `${booking.date.toLocaleDateString('he-IL')} בשעה ${booking.time}`
    const bookingUrl = `${process.env.APP_BASE_URL}/booking`
    
    await smsService.sendBookingCancellationSms(
      booking.customer.phone,
      dateTime,
      bookingUrl
    )

    res.json({
      success: true,
      message: 'ההזמנה בוטלה בהצלחה'
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה בביטול ההזמנה'
    })
  }
})

export default router
