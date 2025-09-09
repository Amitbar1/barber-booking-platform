import { PrismaClient } from '@prisma/client'
import { createSmsService } from './smsAdapter.js'
import jwt from 'jsonwebtoken'

export class HoldService {
  private prisma: PrismaClient
  private smsService: ReturnType<typeof createSmsService>

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.smsService = createSmsService(prisma)
  }

  // Create a hold for a booking slot
  async createHold(params: {
    salonId: string
    serviceId: string
    date: Date
    time: string
    customerName?: string
    customerPhone?: string
  }): Promise<{ success: boolean; holdId?: string; message: string }> {
    try {
      const { salonId, serviceId, date, time, customerName, customerPhone } = params
      
      // Check if slot is already booked or held
      const existingBooking = await this.prisma.booking.findFirst({
        where: {
          salonId,
          serviceId,
          date: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          },
          time,
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        }
      })

      if (existingBooking) {
        return {
          success: false,
          message: 'המשבצת תפוסה'
        }
      }

      // Check for active holds
      const existingHold = await this.prisma.bookingHold.findFirst({
        where: {
          salonId,
          serviceId,
          date: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          },
          time,
          status: 'RESERVED',
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (existingHold) {
        return {
          success: false,
          message: 'המשבצת תפוסה'
        }
      }

      // Create hold
      const expiresAt = new Date(Date.now() + 7 * 60 * 1000) // 7 minutes
      const hold = await this.prisma.bookingHold.create({
        data: {
          salonId,
          serviceId,
          date,
          time,
          customerName,
          customerPhone,
          expiresAt,
          status: 'RESERVED'
        }
      })

      return {
        success: true,
        holdId: hold.id,
        message: 'המשבצת נשמרה לך ל-7 דקות'
      }
    } catch (error) {
      console.error('Create hold error:', error)
      return {
        success: false,
        message: 'שגיאה ביצירת ההזמנה. נא לנסות שוב'
      }
    }
  }

  // Confirm booking from hold
  async confirmBooking(params: {
    holdId: string
    customerName: string
    customerPhone: string
  }): Promise<{ success: boolean; bookingId?: string; manageUrl?: string; message: string }> {
    try {
      const { holdId, customerName, customerPhone } = params

      // Find and validate hold
      const hold = await this.prisma.bookingHold.findUnique({
        where: { id: holdId },
        include: {
          salon: true,
          service: true
        }
      })

      if (!hold) {
        return {
          success: false,
          message: 'ההזמנה לא נמצאה'
        }
      }

      if (hold.status !== 'RESERVED') {
        return {
          success: false,
          message: 'ההזמנה כבר לא פעילה'
        }
      }

      if (hold.expiresAt < new Date()) {
        return {
          success: false,
          message: 'ההזמנה פגה'
        }
      }

      // Normalize phone number
      const normalizedPhone = customerPhone.replace(/\D/g, '')
      const phoneE164 = normalizedPhone.startsWith('0') 
        ? '+972' + normalizedPhone.substring(1)
        : '+' + normalizedPhone

      // Find or create customer
      let customer = await this.prisma.customer.findFirst({
        where: {
          salonId: hold.salonId,
          phone: phoneE164
        }
      })

      if (!customer) {
        customer = await this.prisma.customer.create({
          data: {
            salonId: hold.salonId,
            name: customerName,
            phone: phoneE164
          }
        })
      } else {
        // Update customer name if different
        if (customer.name !== customerName) {
          customer = await this.prisma.customer.update({
            where: { id: customer.id },
            data: { name: customerName }
          })
        }
      }

      // Create booking
      const booking = await this.prisma.booking.create({
        data: {
          salonId: hold.salonId,
          serviceId: hold.serviceId,
          customerId: customer.id,
          date: hold.date,
          time: hold.time,
          status: 'CONFIRMED',
          totalPrice: hold.service.price
        }
      })

      // Update hold status
      await this.prisma.bookingHold.update({
        where: { id: holdId },
        data: { status: 'CONFIRMED' }
      })

      // Generate manage token
      const manageToken = jwt.sign(
        { 
          bookingId: booking.id,
          nonce: Math.random().toString(36).substring(7),
          type: 'manage'
        },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' }
      )

      // Save manage token
      await this.prisma.manageToken.create({
        data: {
          bookingId: booking.id,
          token: manageToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })

      // Generate manage URL
      const manageUrl = `${process.env.APP_BASE_URL}/manage/${manageToken}`

      // Send confirmation SMS
      const dateTime = `${hold.date.toLocaleDateString('he-IL')} בשעה ${hold.time}`
      await this.smsService.sendBookingConfirmationSms(phoneE164, dateTime, manageUrl)

      return {
        success: true,
        bookingId: booking.id,
        manageUrl,
        message: 'התור נקבע בהצלחה'
      }
    } catch (error) {
      console.error('Confirm booking error:', error)
      return {
        success: false,
        message: 'שגיאה באישור ההזמנה. נא לנסות שוב'
      }
    }
  }

  // Cancel hold
  async cancelHold(holdId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.prisma.bookingHold.update({
        where: { id: holdId },
        data: { status: 'CANCELLED' }
      })

      return {
        success: true,
        message: 'ההזמנה בוטלה'
      }
    } catch (error) {
      console.error('Cancel hold error:', error)
      return {
        success: false,
        message: 'שגיאה בביטול ההזמנה'
      }
    }
  }

  // Clean up expired holds
  async cleanupExpiredHolds(): Promise<void> {
    try {
      await this.prisma.bookingHold.updateMany({
        where: {
          status: 'RESERVED',
          expiresAt: {
            lt: new Date()
          }
        },
        data: {
          status: 'EXPIRED'
        }
      })
    } catch (error) {
      console.error('Cleanup expired holds error:', error)
    }
  }

  // Get hold status
  async getHoldStatus(holdId: string): Promise<{ exists: boolean; status?: string; expiresAt?: Date }> {
    try {
      const hold = await this.prisma.bookingHold.findUnique({
        where: { id: holdId },
        select: {
          status: true,
          expiresAt: true
        }
      })

      if (!hold) {
        return { exists: false }
      }

      return {
        exists: true,
        status: hold.status,
        expiresAt: hold.expiresAt
      }
    } catch (error) {
      console.error('Get hold status error:', error)
      return { exists: false }
    }
  }
}
