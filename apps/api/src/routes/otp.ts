import { Router } from 'express'
import Joi from 'joi'
import { validateRequest } from '../middleware/validation.js'
import { OtpService } from '../services/otpService.js'
import { HoldService } from '../services/holdService.js'
import rateLimit from 'express-rate-limit'

const router = Router()

// Rate limiting for OTP requests
const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Rate limit exceeded',
    message: 'יותר מדי בקשות. נא לנסות שוב בעוד 15 דקות'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Validation schemas
const sendOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).required().messages({
    'string.pattern.base': 'מספר טלפון לא תקין'
  })
})

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).required(),
  code: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
    'string.pattern.base': 'קוד האימות חייב להיות 6 ספרות'
  }),
  holdId: Joi.string().required(),
  customerName: Joi.string().min(2).max(50).required()
})

// Send OTP
router.post('/send-otp', otpRateLimit, validateRequest(sendOtpSchema), async (req, res) => {
  try {
    const { phone } = req.body
    const otpService = new OtpService(req.prisma)
    
    const result = await otpService.sendOtp(phone)
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        retryAfter: result.retryAfter
      })
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה פנימית בשרת'
    })
  }
})

// Verify OTP and confirm booking
router.post('/verify-otp', validateRequest(verifyOtpSchema), async (req, res) => {
  try {
    const { phone, code, holdId, customerName } = req.body
    const otpService = new OtpService(req.prisma)
    const holdService = new HoldService(req.prisma)
    
    // Verify OTP first
    const otpResult = await otpService.verifyOtp(phone, code)
    
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      })
    }
    
    // Confirm booking from hold
    const holdResult = await holdService.confirmBooking({
      holdId,
      customerName,
      customerPhone: phone
    })
    
    if (!holdResult.success) {
      return res.status(400).json({
        success: false,
        message: holdResult.message
      })
    }
    
    res.json({
      success: true,
      message: holdResult.message,
      bookingId: holdResult.bookingId,
      manageUrl: holdResult.manageUrl
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה פנימית בשרת'
    })
  }
})

export default router
