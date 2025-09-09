import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        salonId?: string
      }
      prisma?: PrismaClient
      io?: any
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Get user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        salons: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.toString(),
      salonId: user.salons[0]?.id
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

export const requireSalonAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const salonId = req.params.salonId || req.body.salonId

    if (!salonId) {
      return res.status(400).json({ error: 'Salon ID required' })
    }

    // Check if user has access to this salon
    const salon = await prisma.salon.findFirst({
      where: {
        id: salonId,
        OR: [
          { ownerId: req.user.id },
          { 
            owner: {
              role: 'ADMIN'
            }
          }
        ]
      }
    })

    if (!salon) {
      return res.status(403).json({ error: 'Access denied to this salon' })
    }

    next()
  } catch (error) {
    console.error('Salon access middleware error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
