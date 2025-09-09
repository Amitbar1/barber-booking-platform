import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import { getCleanupWorker } from './workers/cleanupWorker.js'

// Import routes
import authRoutes from './routes/auth.js'
import salonRoutes from './routes/salons.js'
import bookingRoutes from './routes/bookings.js'
import customerRoutes from './routes/customers.js'
import serviceRoutes from './routes/services.js'
import adminRoutes from './routes/admin.js'
import otpRoutes from './routes/otp.js'
import holdRoutes from './routes/hold.js'
import manageRoutes from './routes/manage.js'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

// Initialize Prisma with error handling
let prisma: PrismaClient
try {
  prisma = new PrismaClient()
  console.log('✅ Prisma client initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Prisma client:', error)
  process.exit(1)
}

const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Make Prisma and Socket.IO available to routes
app.use((req, res, next) => {
  req.prisma = prisma
  req.io = io
  next()
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/salons', salonRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/otp', otpRoutes)
app.use('/api/hold', holdRoutes)
app.use('/api/manage', manageRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Join salon room for real-time updates
  socket.on('join-salon', (salonId: string) => {
    socket.join(`salon-${salonId}`)
  })

  // Leave salon room
  socket.on('leave-salon', (salonId: string) => {
    socket.leave(`salon-${salonId}`)
  })
})

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
   
  console.error('Error:', err)
  
  if (err && typeof err === 'object' && 'type' in err) {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'The request body contains invalid JSON'
      })
    }

    if (err.type === 'entity.too.large') {
      return res.status(413).json({
        error: 'Payload too large',
        message: 'The request body is too large'
      })
    }
  }

  const status = (err && typeof err === 'object' && 'status' in err) ? (err.status as number) : 500
  const message = (err && typeof err === 'object' && 'message' in err) ? (err.message as string) : 'Internal Server Error'
  const stack = (err && typeof err === 'object' && 'stack' in err) ? (err.stack as string) : undefined

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && stack && { stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  
  // Start cleanup worker
  const cleanupWorker = getCleanupWorker(prisma)
  cleanupWorker.start(1) // Run every minute
})

export default app
