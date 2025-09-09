import { Router } from 'express'
import Joi from 'joi'
import { validateRequest } from '../middleware/validation.js'
import { HoldService } from '../services/holdService.js'

const router = Router()

// Validation schemas
const createHoldSchema = Joi.object({
  salonId: Joi.string().required(),
  serviceId: Joi.string().required(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'פורמט שעה לא תקין (HH:MM)'
  }),
  customerName: Joi.string().min(2).max(50).optional(),
  customerPhone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).optional().messages({
    'string.pattern.base': 'מספר טלפון לא תקין'
  })
})

const cancelHoldSchema = Joi.object({
  holdId: Joi.string().required()
})

// Create hold
router.post('/create', validateRequest(createHoldSchema), async (req, res) => {
  try {
    const { salonId, serviceId, date, time, customerName, customerPhone } = req.body
    const holdService = new HoldService(req.prisma)
    
    const result = await holdService.createHold({
      salonId,
      serviceId,
      date: new Date(date),
      time,
      customerName,
      customerPhone
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        holdId: result.holdId
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      })
    }
  } catch (error) {
    console.error('Create hold error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה פנימית בשרת'
    })
  }
})

// Cancel hold
router.post('/cancel', validateRequest(cancelHoldSchema), async (req, res) => {
  try {
    const { holdId } = req.body
    const holdService = new HoldService(req.prisma)
    
    const result = await holdService.cancelHold(holdId)
    
    res.json({
      success: result.success,
      message: result.message
    })
  } catch (error) {
    console.error('Cancel hold error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה פנימית בשרת'
    })
  }
})

// Get hold status
router.get('/status/:holdId', async (req, res) => {
  try {
    const { holdId } = req.params
    const holdService = new HoldService(req.prisma)
    
    const result = await holdService.getHoldStatus(holdId)
    
    res.json({
      exists: result.exists,
      status: result.status,
      expiresAt: result.expiresAt
    })
  } catch (error) {
    console.error('Get hold status error:', error)
    res.status(500).json({
      success: false,
      message: 'שגיאה פנימית בשרת'
    })
  }
})

export default router
