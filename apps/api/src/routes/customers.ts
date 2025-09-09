import { Router } from 'express'
import Joi from 'joi'
import { validateRequest, validateQuery, validateParams } from '../middleware/validation.js'
import { authenticateToken, requireSalonAccess } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const createCustomerSchema = Joi.object({
  salonId: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().optional(),
  dateOfBirth: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional()
})

const updateCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().optional(),
  dateOfBirth: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional(),
  isActive: Joi.boolean().optional()
})

const customerParamsSchema = Joi.object({
  customerId: Joi.string().required()
})

const customerQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  salonId: Joi.string().optional()
})

// Get customers (authenticated)
router.get('/', authenticateToken, validateQuery(customerQuerySchema), async (req, res) => {
  try {
    const { page, limit, search, salonId } = req.query as any
    const skip = (page - 1) * limit
    const userId = req.user!.id

    const where: any = {}

    // If user is not admin, only show customers from their salons
    if (req.user!.role !== 'ADMIN') {
      const userSalons = await req.prisma.salon.findMany({
        where: { ownerId: userId },
        select: { id: true }
      })
      where.salonId = { in: userSalons.map(s => s.id) }
    } else if (salonId) {
      where.salonId = salonId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [customers, total] = await Promise.all([
      req.prisma.customer.findMany({
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
          bookings: {
            select: {
              id: true,
              date: true,
              status: true,
              totalPrice: true
            },
            orderBy: { date: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.customer.count({ where })
    ])

    res.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get customers error:', error)
    res.status(500).json({
      error: 'Failed to fetch customers',
      message: 'An error occurred while fetching customers'
    })
  }
})

// Get customer by ID (authenticated)
router.get('/:customerId', authenticateToken, validateParams(customerParamsSchema), async (req, res) => {
  try {
    const { customerId } = req.params
    const userId = req.user!.id

    const customer = await req.prisma.customer.findFirst({
      where: {
        id: customerId,
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
            slug: true
          }
        },
        bookings: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true,
                category: true
              }
            }
          },
          orderBy: { date: 'desc' }
        },
        reviews: {
          include: {
            salon: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        message: 'The requested customer does not exist or you do not have access to them'
      })
    }

    res.json({ customer })
  } catch (error) {
    console.error('Get customer error:', error)
    res.status(500).json({
      error: 'Failed to fetch customer',
      message: 'An error occurred while fetching customer data'
    })
  }
})

// Create customer (authenticated)
router.post('/', authenticateToken, validateRequest(createCustomerSchema), async (req, res) => {
  try {
    const customerData = req.body
    const { salonId, name, phone, email, dateOfBirth, notes } = customerData
    const userId = req.user!.id

    // Verify salon access
    const salon = await req.prisma.salon.findFirst({
      where: {
        id: salonId,
        OR: [
          { ownerId: userId },
          { 
            owner: {
              role: 'ADMIN'
            }
          }
        ]
      }
    })

    if (!salon) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this salon'
      })
    }

    // Check if customer already exists with this phone number
    const existingCustomer = await req.prisma.customer.findFirst({
      where: {
        salonId,
        phone
      }
    })

    if (existingCustomer) {
      return res.status(409).json({
        error: 'Customer already exists',
        message: 'A customer with this phone number already exists in this salon'
      })
    }

    const customer = await req.prisma.customer.create({
      data: {
        salonId,
        name,
        phone,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        notes
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    })
  } catch (error) {
    console.error('Create customer error:', error)
    res.status(500).json({
      error: 'Failed to create customer',
      message: 'An error occurred while creating the customer'
    })
  }
})

// Update customer (authenticated + salon access)
router.put('/:customerId', authenticateToken, validateParams(customerParamsSchema), validateRequest(updateCustomerSchema), async (req, res) => {
  try {
    const { customerId } = req.params
    const updateData = req.body
    const userId = req.user!.id

    // Check if customer exists and user has access
    const existingCustomer = await req.prisma.customer.findFirst({
      where: {
        id: customerId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingCustomer) {
      return res.status(404).json({
        error: 'Customer not found',
        message: 'The requested customer does not exist or you do not have access to them'
      })
    }

    // If updating phone, check for conflicts
    if (updateData.phone && updateData.phone !== existingCustomer.phone) {
      const conflictingCustomer = await req.prisma.customer.findFirst({
        where: {
          salonId: existingCustomer.salonId,
          phone: updateData.phone,
          id: { not: customerId }
        }
      })

      if (conflictingCustomer) {
        return res.status(409).json({
          error: 'Phone number already exists',
          message: 'A customer with this phone number already exists in this salon'
        })
      }
    }

    const customer = await req.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    res.json({
      message: 'Customer updated successfully',
      customer
    })
  } catch (error) {
    console.error('Update customer error:', error)
    res.status(500).json({
      error: 'Failed to update customer',
      message: 'An error occurred while updating the customer'
    })
  }
})

// Delete customer (authenticated + salon access)
router.delete('/:customerId', authenticateToken, validateParams(customerParamsSchema), async (req, res) => {
  try {
    const { customerId } = req.params
    const userId = req.user!.id

    // Check if customer exists and user has access
    const existingCustomer = await req.prisma.customer.findFirst({
      where: {
        id: customerId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingCustomer) {
      return res.status(404).json({
        error: 'Customer not found',
        message: 'The requested customer does not exist or you do not have access to them'
      })
    }

    // Check if customer has active bookings
    const activeBookings = await req.prisma.booking.count({
      where: {
        customerId,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeBookings > 0) {
      return res.status(409).json({
        error: 'Cannot delete customer',
        message: 'Customer has active bookings. Please cancel them first.'
      })
    }

    await req.prisma.customer.update({
      where: { id: customerId },
      data: { isActive: false }
    })

    res.json({
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    console.error('Delete customer error:', error)
    res.status(500).json({
      error: 'Failed to delete customer',
      message: 'An error occurred while deleting the customer'
    })
  }
})

export default router
