import { Router } from 'express'
import Joi from 'joi'
import { validateRequest, validateQuery, validateParams } from '../middleware/validation.js'
import { authenticateToken, requireRole, requireSalonAccess } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const createSalonSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().min(5).max(200).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().optional(),
  logo: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional()
})

const updateSalonSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().min(5).max(200).optional(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  logo: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  isActive: Joi.boolean().optional()
})

const salonParamsSchema = Joi.object({
  salonId: Joi.string().required()
})

const salonQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  category: Joi.string().optional(),
  city: Joi.string().optional()
})

// Get all salons (public)
router.get('/', validateQuery(salonQuerySchema), async (req, res) => {
  try {
    const { page, limit, search, category, city } = req.query as any
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (city) {
      where.address = { contains: city, mode: 'insensitive' }
    }

    const [salons, total] = await Promise.all([
      req.prisma.salon.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          logo: true,
          images: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          services: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
              category: true,
              images: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.salon.count({ where })
    ])

    res.json({
      salons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get salons error:', error)
    res.status(500).json({
      error: 'Failed to fetch salons',
      message: 'An error occurred while fetching salons'
    })
  }
})

// Get salon by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const salon = await req.prisma.salon.findUnique({
      where: { 
        slug,
        isActive: true
      },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: true,
            images: true
          }
        },
        workingHours: {
          select: {
            dayOfWeek: true,
            dayName: true,
            openTime: true,
            closeTime: true,
            isClosed: true
          },
          orderBy: { dayOfWeek: 'asc' }
        },
        reviews: {
          where: { isVisible: true },
          include: {
            customer: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!salon) {
      return res.status(404).json({
        error: 'Salon not found',
        message: 'The requested salon does not exist or is not active'
      })
    }

    res.json({ salon })
  } catch (error) {
    console.error('Get salon by slug error:', error)
    res.status(500).json({
      error: 'Failed to fetch salon',
      message: 'An error occurred while fetching salon data'
    })
  }
})

// Get salon by ID (public)
router.get('/:salonId', validateParams(salonParamsSchema), async (req, res) => {
  try {
    const { salonId } = req.params

    const salon = await req.prisma.salon.findUnique({
      where: { 
        id: salonId,
        isActive: true
      },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: true,
            images: true
          }
        },
        workingHours: {
          select: {
            dayOfWeek: true,
            dayName: true,
            openTime: true,
            closeTime: true,
            isClosed: true
          },
          orderBy: { dayOfWeek: 'asc' }
        },
        reviews: {
          where: { isVisible: true },
          include: {
            customer: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!salon) {
      return res.status(404).json({
        error: 'Salon not found',
        message: 'The requested salon does not exist or is not active'
      })
    }

    res.json({ salon })
  } catch (error) {
    console.error('Get salon error:', error)
    res.status(500).json({
      error: 'Failed to fetch salon',
      message: 'An error occurred while fetching salon data'
    })
  }
})

// Create salon (authenticated)
router.post('/', authenticateToken, requireRole(['ADMIN', 'SALON_OWNER']), validateRequest(createSalonSchema), async (req, res) => {
  try {
    const salonData = req.body
    const userId = req.user!.id

    // Generate slug from name
    const slug = salonData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists
    const existingSalon = await req.prisma.salon.findUnique({
      where: { slug }
    })

    if (existingSalon) {
      return res.status(400).json({
        error: 'Slug already exists',
        message: 'A salon with this name already exists'
      })
    }

    const salon = await req.prisma.salon.create({
      data: {
        ...salonData,
        slug,
        ownerId: userId,
        images: salonData.images || []
      },
      include: {
        services: true,
        workingHours: true
      }
    })

    // Emit real-time update
    req.io.emit('salon-created', { salon })

    res.status(201).json({
      message: 'Salon created successfully',
      salon
    })
  } catch (error) {
    console.error('Create salon error:', error)
    res.status(500).json({
      error: 'Failed to create salon',
      message: 'An error occurred while creating the salon'
    })
  }
})

// Update salon (authenticated + salon access)
router.put('/:salonId', authenticateToken, requireSalonAccess, validateParams(salonParamsSchema), validateRequest(updateSalonSchema), async (req, res) => {
  try {
    const { salonId } = req.params
    const updateData = req.body

    // If name is being updated, update slug too
    if (updateData.name) {
      const slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Check if new slug already exists
      const existingSalon = await req.prisma.salon.findFirst({
        where: { 
          slug,
          id: { not: salonId }
        }
      })

      if (existingSalon) {
        return res.status(400).json({
          error: 'Slug already exists',
          message: 'A salon with this name already exists'
        })
      }

      updateData.slug = slug
    }

    const salon = await req.prisma.salon.update({
      where: { id: salonId },
      data: updateData,
      include: {
        services: true,
        workingHours: true
      }
    })

    // Emit real-time update
    req.io.to(`salon-${salonId}`).emit('salon-updated', { salon })

    res.json({
      message: 'Salon updated successfully',
      salon
    })
  } catch (error) {
    console.error('Update salon error:', error)
    res.status(500).json({
      error: 'Failed to update salon',
      message: 'An error occurred while updating the salon'
    })
  }
})

// Delete salon (authenticated + salon access)
router.delete('/:salonId', authenticateToken, requireSalonAccess, validateParams(salonParamsSchema), async (req, res) => {
  try {
    const { salonId } = req.params

    await req.prisma.salon.update({
      where: { id: salonId },
      data: { isActive: false }
    })

    // Emit real-time update
    req.io.to(`salon-${salonId}`).emit('salon-deleted', { salonId })

    res.json({
      message: 'Salon deleted successfully'
    })
  } catch (error) {
    console.error('Delete salon error:', error)
    res.status(500).json({
      error: 'Failed to delete salon',
      message: 'An error occurred while deleting the salon'
    })
  }
})

export default router
