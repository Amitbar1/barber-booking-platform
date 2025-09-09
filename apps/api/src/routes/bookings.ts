import { Router } from 'express'
import Joi from 'joi'
import { validateRequest, validateQuery, validateParams } from '../middleware/validation.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const createBookingSchema = Joi.object({
  salonId: Joi.string().required(),
  serviceId: Joi.string().required(),
  customerId: Joi.string().optional(),
  customerName: Joi.string().min(2).max(100).required(),
  customerPhone: Joi.string().min(10).max(20).required(),
  customerEmail: Joi.string().email().optional(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  notes: Joi.string().max(500).optional()
})

const updateBookingSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW').optional(),
  notes: Joi.string().max(500).optional(),
  date: Joi.date().iso().optional(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
})

const bookingParamsSchema = Joi.object({
  bookingId: Joi.string().required()
})

const bookingQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW').optional(),
  date: Joi.date().iso().optional(),
  salonId: Joi.string().optional()
})

// Get bookings (authenticated)
router.get('/', authenticateToken, validateQuery(bookingQuerySchema), async (req, res) => {
  try {
    const { page, limit, status, date, salonId } = req.query as any
    const skip = (page - 1) * limit
    const userId = req.user!.id

    const where: any = {}

    // If user is not admin, only show their salon's bookings
    if (req.user!.role !== 'ADMIN') {
      const userSalons = await req.prisma.salon.findMany({
        where: { ownerId: userId },
        select: { id: true }
      })
      where.salonId = { in: userSalons.map(s => s.id) }
    } else if (salonId) {
      where.salonId = salonId
    }

    if (status) {
      where.status = status
    }

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const [bookings, total] = await Promise.all([
      req.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          salon: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
              category: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true
            }
          }
        },
        orderBy: { date: 'asc' }
      }),
      req.prisma.booking.count({ where })
    ])

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: 'An error occurred while fetching bookings'
    })
  }
})

// Get booking by ID (authenticated)
router.get('/:bookingId', authenticateToken, validateParams(bookingParamsSchema), async (req, res) => {
  try {
    const { bookingId } = req.params
    const userId = req.user!.id

    const booking = await req.prisma.booking.findFirst({
      where: {
        id: bookingId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true,
            description: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'The requested booking does not exist or you do not have access to it'
      })
    }

    res.json({ booking })
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({
      error: 'Failed to fetch booking',
      message: 'An error occurred while fetching booking data'
    })
  }
})

// Create booking (public or authenticated)
router.post('/', validateRequest(createBookingSchema), async (req, res) => {
  try {
    const bookingData = req.body
    const { salonId, serviceId, customerName, customerPhone, customerEmail, date, time, notes } = bookingData

    // Verify salon and service exist
    const salon = await req.prisma.salon.findUnique({
      where: { id: salonId, isActive: true },
      include: {
        services: {
          where: { id: serviceId, isActive: true }
        }
      }
    })

    if (!salon) {
      return res.status(404).json({
        error: 'Salon not found',
        message: 'The requested salon does not exist or is not active'
      })
    }

    if (salon.services.length === 0) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service does not exist or is not active'
      })
    }

    const service = salon.services[0]

    // Check for existing booking at the same time
    const existingBooking = await req.prisma.booking.findFirst({
      where: {
        salonId,
        date: new Date(date),
        time,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (existingBooking) {
      return res.status(409).json({
        error: 'Time slot unavailable',
        message: 'This time slot is already booked'
      })
    }

    // Find or create customer
    let customer = await req.prisma.customer.findFirst({
      where: {
        salonId,
        phone: customerPhone
      }
    })

    if (!customer) {
      customer = await req.prisma.customer.create({
        data: {
          salonId,
          name: customerName,
          phone: customerPhone,
          email: customerEmail
        }
      })
    } else {
      // Update customer info if provided
      await req.prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName,
          email: customerEmail || customer.email
        }
      })
    }

    // Create booking
    const booking = await req.prisma.booking.create({
      data: {
        salonId,
        serviceId,
        customerId: customer.id,
        userId: req.user?.id,
        date: new Date(date),
        time,
        notes,
        totalPrice: service.price,
        status: 'PENDING'
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    // Create notification for salon owner
    await req.prisma.notification.create({
      data: {
        salonId,
        bookingId: booking.id,
        type: 'BOOKING_CREATED',
        title: 'תור חדש',
        message: `תור חדש מ-${customerName} ל-${service.name}`
      }
    })

    // Emit real-time update
    req.io.to(`salon-${salonId}`).emit('booking-created', { booking })

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({
      error: 'Failed to create booking',
      message: 'An error occurred while creating the booking'
    })
  }
})

// Update booking (authenticated + salon access)
router.put('/:bookingId', authenticateToken, validateParams(bookingParamsSchema), validateRequest(updateBookingSchema), async (req, res) => {
  try {
    const { bookingId } = req.params
    const updateData = req.body
    const userId = req.user!.id

    // Check if booking exists and user has access
    const existingBooking = await req.prisma.booking.findFirst({
      where: {
        id: bookingId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingBooking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'The requested booking does not exist or you do not have access to it'
      })
    }

    // If updating date/time, check for conflicts
    if (updateData.date || updateData.time) {
      const newDate = updateData.date ? new Date(updateData.date) : existingBooking.date
      const newTime = updateData.time || existingBooking.time

      const conflictingBooking = await req.prisma.booking.findFirst({
        where: {
          salonId: existingBooking.salonId,
          date: newDate,
          time: newTime,
          status: { in: ['PENDING', 'CONFIRMED'] },
          id: { not: bookingId }
        }
      })

      if (conflictingBooking) {
        return res.status(409).json({
          error: 'Time slot unavailable',
          message: 'This time slot is already booked'
        })
      }
    }

    const booking = await req.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    // Create notification
    await req.prisma.notification.create({
      data: {
        salonId: booking.salonId,
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMED',
        title: 'תור עודכן',
        message: `התור של ${booking.customer.name} עודכן`
      }
    })

    // Emit real-time update
    req.io.to(`salon-${booking.salonId}`).emit('booking-updated', { booking })

    res.json({
      message: 'Booking updated successfully',
      booking
    })
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({
      error: 'Failed to update booking',
      message: 'An error occurred while updating the booking'
    })
  }
})

// Delete booking (authenticated + salon access)
router.delete('/:bookingId', authenticateToken, validateParams(bookingParamsSchema), async (req, res) => {
  try {
    const { bookingId } = req.params
    const userId = req.user!.id

    // Check if booking exists and user has access
    const existingBooking = await req.prisma.booking.findFirst({
      where: {
        id: bookingId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingBooking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'The requested booking does not exist or you do not have access to it'
      })
    }

    await req.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    })

    // Create notification
    await req.prisma.notification.create({
      data: {
        salonId: existingBooking.salonId,
        bookingId: existingBooking.id,
        type: 'BOOKING_CANCELLED',
        title: 'תור בוטל',
        message: `התור של ${existingBooking.customerId} בוטל`
      }
    })

    // Emit real-time update
    req.io.to(`salon-${existingBooking.salonId}`).emit('booking-cancelled', { bookingId })

    res.json({
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({
      error: 'Failed to cancel booking',
      message: 'An error occurred while cancelling the booking'
    })
  }
})

export default router
