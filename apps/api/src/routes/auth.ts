import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { validateRequest } from '../middleware/validation.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await req.prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await req.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'SALON_OWNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    })
  }
})

// Login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await req.prisma.user.findUnique({
      where: { email },
      include: {
        salons: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        salons: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        salons: true
      }
    })

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Failed to get user',
      message: 'An error occurred while fetching user data'
    })
  }
})

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate new token
    const token = jwt.sign(
      { userId: req.user!.id, email: req.user!.email, role: req.user!.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Token refreshed successfully',
      token
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing token'
    })
  }
})

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout successful'
  })
})

export default router
