import { PrismaClient } from '@prisma/client'
import { createSmsService } from './smsAdapter.js'

export class OtpService {
  private prisma: PrismaClient
  private smsService: ReturnType<typeof createSmsService>

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.smsService = createSmsService(prisma)
  }

  // Generate 6-digit OTP code
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Normalize phone number to E.164 format
  private normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // If starts with 0, replace with +972
    if (digits.startsWith('0')) {
      return '+972' + digits.substring(1)
    }
    
    // If doesn't start with +, add it
    if (!digits.startsWith('+')) {
      return '+' + digits
    }
    
    return digits
  }

  // Check if phone number can receive OTP (rate limiting)
  private async canSendOtp(phone: string): Promise<{ canSend: boolean; retryAfter?: number }> {
    const normalizedPhone = this.normalizePhoneNumber(phone)
    const now = new Date()
    
    // Check for recent OTP attempts (last 45 seconds)
    const recentOtp = await this.prisma.otpCode.findFirst({
      where: {
        phone: normalizedPhone,
        createdAt: {
          gte: new Date(now.getTime() - 45 * 1000) // 45 seconds ago
        }
      }
    })

    if (recentOtp) {
      const retryAfter = Math.ceil((recentOtp.createdAt.getTime() + 45 * 1000 - now.getTime()) / 1000)
      return { canSend: false, retryAfter }
    }

    // Check for too many attempts in last 3 hours
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
    const recentAttempts = await this.prisma.otpCode.count({
      where: {
        phone: normalizedPhone,
        createdAt: {
          gte: threeHoursAgo
        }
      }
    })

    if (recentAttempts >= 5) {
      return { canSend: false }
    }

    return { canSend: true }
  }

  // Send OTP code via SMS
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; retryAfter?: number }> {
    try {
      const normalizedPhone = this.normalizePhoneNumber(phone)
      
      // Check rate limiting
      const rateLimitCheck = await this.canSendOtp(phone)
      if (!rateLimitCheck.canSend) {
        return {
          success: false,
          message: rateLimitCheck.retryAfter 
            ? `נא לנסות שוב בעוד ${rateLimitCheck.retryAfter} שניות`
            : 'יותר מדי ניסיונות. נא לנסות שוב בעוד 3 שעות',
          retryAfter: rateLimitCheck.retryAfter
        }
      }

      // Generate OTP code
      const code = this.generateOtpCode()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      // Invalidate any existing OTP for this phone
      await this.prisma.otpCode.updateMany({
        where: {
          phone: normalizedPhone,
          isUsed: false
        },
        data: {
          isUsed: true
        }
      })

      // Create new OTP record
      await this.prisma.otpCode.create({
        data: {
          phone: normalizedPhone,
          code,
          expiresAt,
          maxAttempts: 5
        }
      })

      // Send SMS
      await this.smsService.sendOtpSms(normalizedPhone, code)

      return {
        success: true,
        message: 'קוד האימות נשלח בהצלחה'
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        message: 'שגיאה בשליחת קוד האימות. נא לנסות שוב'
      }
    }
  }

  // Verify OTP code
  async verifyOtp(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const normalizedPhone = this.normalizePhoneNumber(phone)
      
      // Find active OTP
      const otpRecord = await this.prisma.otpCode.findFirst({
        where: {
          phone: normalizedPhone,
          code,
          isUsed: false,
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (!otpRecord) {
        return {
          success: false,
          message: 'קוד האימות לא תקין או פג תוקף'
        }
      }

      // Check attempts
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        return {
          success: false,
          message: 'יותר מדי ניסיונות. נא לבקש קוד חדש'
        }
      }

      // Mark as used
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { isUsed: true }
      })

      return {
        success: true,
        message: 'קוד האימות אומת בהצלחה'
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return {
        success: false,
        message: 'שגיאה באימות הקוד. נא לנסות שוב'
      }
    }
  }

  // Clean up expired OTP codes
  async cleanupExpiredOtps(): Promise<void> {
    try {
      await this.prisma.otpCode.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isUsed: true }
          ]
        }
      })
    } catch (error) {
      console.error('Cleanup expired OTPs error:', error)
    }
  }
}
