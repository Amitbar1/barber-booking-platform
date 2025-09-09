import { Router } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = Router()

// All admin routes require authentication and admin role
router.use(authenticateToken)
router.use(requireRole(['ADMIN']))

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalSalons,
      activeSalons,
      totalBookings,
      todayBookings,
      totalRevenue,
      totalCustomers,
      recentBookings,
      topServices
    ] = await Promise.all([
      req.prisma.salon.count(),
      req.prisma.salon.count({ where: { isActive: true } }),
      req.prisma.booking.count(),
      req.prisma.booking.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      req.prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
      }),
      req.prisma.customer.count({ where: { isActive: true } }),
      req.prisma.booking.findMany({
        take: 10,
        include: {
          salon: { select: { name: true, slug: true } },
          service: { select: { name: true, category: true } },
          customer: { select: { name: true, phone: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.service.groupBy({
        by: ['name', 'category'],
        _count: { bookings: true },
        _sum: { price: true },
        orderBy: { _count: { bookings: 'desc' } },
        take: 10
      })
    ])

    const stats = {
      totalSalons,
      activeSalons,
      totalBookings,
      todayBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalCustomers,
      recentBookings,
      topServices
    }

    res.json({ stats })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      message: 'An error occurred while fetching dashboard statistics'
    })
  }
})

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query as any
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      req.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          salons: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.user.count({ where })
    ])

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while fetching users'
    })
  }
})

// Get all salons (admin view)
router.get('/salons', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query as any
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const [salons, total] = await Promise.all([
      req.prisma.salon.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              bookings: true,
              customers: true,
              services: true
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
    console.error('Get admin salons error:', error)
    res.status(500).json({
      error: 'Failed to fetch salons',
      message: 'An error occurred while fetching salons'
    })
  }
})

// Get system notifications
router.get('/notifications', async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query as any
    const skip = (page - 1) * limit

    const where: any = {}
    if (isRead !== undefined) {
      where.isRead = isRead === 'true'
    }

    const [notifications, total] = await Promise.all([
      req.prisma.notification.findMany({
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
          booking: {
            select: {
              id: true,
              date: true,
              time: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.notification.count({ where })
    ])

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: 'An error occurred while fetching notifications'
    })
  }
})

// Mark notification as read
router.patch('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params

    await req.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification as read error:', error)
    res.status(500).json({
      error: 'Failed to mark notification as read',
      message: 'An error occurred while updating the notification'
    })
  }
})

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d' } = req.query as any
    
    const dateFilter: any = {}
    const now = new Date()
    
    switch (period) {
      case '7d':
        dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        dateFilter.gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    const [
      bookingsByDate,
      revenueByDate,
      bookingsByStatus,
      topSalons,
      topServices
    ] = await Promise.all([
      req.prisma.booking.groupBy({
        by: ['date'],
        _count: { id: true },
        where: { date: dateFilter },
        orderBy: { date: 'asc' }
      }),
      req.prisma.booking.groupBy({
        by: ['date'],
        _sum: { totalPrice: true },
        where: { 
          date: dateFilter,
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        orderBy: { date: 'asc' }
      }),
      req.prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      req.prisma.salon.findMany({
        take: 10,
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        }
      }),
      req.prisma.service.findMany({
        take: 10,
        include: {
          _count: {
            select: {
              bookings: true
            }
          },
          salon: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        }
      })
    ])

    const analytics = {
      bookingsByDate,
      revenueByDate,
      bookingsByStatus,
      topSalons,
      topServices
    }

    res.json({ analytics })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'An error occurred while fetching analytics data'
    })
  }
})

export default router
