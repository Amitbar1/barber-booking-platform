import { Router } from 'express'
import Joi from 'joi'
import { validateRequest, validateQuery, validateParams } from '../middleware/validation.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const createServiceSchema = Joi.object({
  salonId: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().positive().required(),
  category: Joi.string().min(2).max(50).required(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional()
})

const updateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  duration: Joi.number().integer().positive().optional(),
  category: Joi.string().min(2).max(50).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  isActive: Joi.boolean().optional()
})

const serviceParamsSchema = Joi.object({
  serviceId: Joi.string().required()
})

const serviceQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().optional(),
  salonId: Joi.string().optional(),
  isActive: Joi.boolean().optional()
})

// Get services (public or authenticated)
router.get('/', validateQuery(serviceQuerySchema), async (req, res) => {
  try {
    const { page, limit, category, salonId, isActive } = req.query as any
    const skip = (page - 1) * limit

    const where: any = {}

    if (salonId) {
      where.salonId = salonId
    }

    if (category) {
      where.category = category
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true'
    } else if (!req.user) {
      // If not authenticated, only show active services
      where.isActive = true
    }

    const [services, total] = await Promise.all([
      req.prisma.service.findMany({
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
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.service.count({ where })
    ])

    res.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get services error:', error)
    res.status(500).json({
      error: 'Failed to fetch services',
      message: 'An error occurred while fetching services'
    })
  }
})

// Get service by ID (public or authenticated)
router.get('/:serviceId', validateParams(serviceParamsSchema), async (req, res) => {
  try {
    const { serviceId } = req.params

    const service = await req.prisma.service.findFirst({
      where: {
        id: serviceId,
        ...(req.user ? {} : { isActive: true })
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service does not exist or is not active'
      })
    }

    res.json({ service })
  } catch (error) {
    console.error('Get service error:', error)
    res.status(500).json({
      error: 'Failed to fetch service',
      message: 'An error occurred while fetching service data'
    })
  }
})

// Create service (authenticated)
router.post('/', authenticateToken, validateRequest(createServiceSchema), async (req, res) => {
  try {
    const serviceData = req.body
    const { salonId, name, description, price, duration, category, images } = serviceData
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

    const service = await req.prisma.service.create({
      data: {
        salonId,
        name,
        description,
        price,
        duration,
        category,
        images: images || []
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

    // Emit real-time update
    req.io.to(`salon-${salonId}`).emit('service-created', { service })

    res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    console.error('Create service error:', error)
    res.status(500).json({
      error: 'Failed to create service',
      message: 'An error occurred while creating the service'
    })
  }
})

// Update service (authenticated + salon access)
router.put('/:serviceId', authenticateToken, validateParams(serviceParamsSchema), validateRequest(updateServiceSchema), async (req, res) => {
  try {
    const { serviceId } = req.params
    const updateData = req.body
    const userId = req.user!.id

    // Check if service exists and user has access
    const existingService = await req.prisma.service.findFirst({
      where: {
        id: serviceId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingService) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service does not exist or you do not have access to it'
      })
    }

    const service = await req.prisma.service.update({
      where: { id: serviceId },
      data: updateData,
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

    // Emit real-time update
    req.io.to(`salon-${service.salonId}`).emit('service-updated', { service })

    res.json({
      message: 'Service updated successfully',
      service
    })
  } catch (error) {
    console.error('Update service error:', error)
    res.status(500).json({
      error: 'Failed to update service',
      message: 'An error occurred while updating the service'
    })
  }
})

// Delete service (authenticated + salon access)
router.delete('/:serviceId', authenticateToken, validateParams(serviceParamsSchema), async (req, res) => {
  try {
    const { serviceId } = req.params
    const userId = req.user!.id

    // Check if service exists and user has access
    const existingService = await req.prisma.service.findFirst({
      where: {
        id: serviceId,
        ...(req.user!.role !== 'ADMIN' && {
          salon: {
            ownerId: userId
          }
        })
      }
    })

    if (!existingService) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service does not exist or you do not have access to it'
      })
    }

    // Check if service has active bookings
    const activeBookings = await req.prisma.booking.count({
      where: {
        serviceId,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeBookings > 0) {
      return res.status(409).json({
        error: 'Cannot delete service',
        message: 'Service has active bookings. Please cancel them first or deactivate the service instead.'
      })
    }

    await req.prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false }
    })

    // Emit real-time update
    req.io.to(`salon-${existingService.salonId}`).emit('service-deleted', { serviceId })

    res.json({
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(500).json({
      error: 'Failed to delete service',
      message: 'An error occurred while deleting the service'
    })
  }
})

export default router
