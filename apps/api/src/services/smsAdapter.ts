import { PrismaClient } from '@prisma/client'

export interface SmsProvider {
  sendSms(params: { toE164: string; text: string }): Promise<{ providerMessageId: string }>
}

export interface SmsConfig {
  baseUrl: string
  apiKey: string
  senderId: string
}

export class InfobipSmsProvider implements SmsProvider {
  private config: SmsConfig

  constructor(config: SmsConfig) {
    this.config = config
  }

  async sendSms({ toE164, text }: { toE164: string; text: string }): Promise<{ providerMessageId: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/sms/2/text/single`, {
        method: 'POST',
        headers: {
          'Authorization': `App ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          from: this.config.senderId,
          to: toE164,
          text: text
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Infobip API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      if (data.messages && data.messages.length > 0) {
        const message = data.messages[0]
        if (message.status?.groupName === 'PENDING_ACCEPTED' || message.status?.groupName === 'ACCEPTED') {
          return { providerMessageId: message.messageId || 'unknown' }
        } else {
          throw new Error(`SMS sending failed: ${message.status?.groupName} - ${message.status?.description}`)
        }
      } else {
        throw new Error('No message data returned from Infobip')
      }
    } catch (error) {
      console.error('Infobip SMS sending error:', error)
      throw new Error(`Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export class MockSmsService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async sendOtpSms(phone: string, code: string): Promise<{ providerMessageId: string }> {
    console.log(`📱 Mock SMS sent to ${phone}: קוד האימות שלך הוא ${code}`)
    return { providerMessageId: 'mock-' + Date.now() }
  }

  async sendBookingConfirmationSms(phone: string, dateTime: string, manageUrl: string): Promise<{ providerMessageId: string }> {
    console.log(`📱 Mock SMS sent to ${phone}: התור נקבע ל־${dateTime}. ניהול/ביטול: ${manageUrl}`)
    return { providerMessageId: 'mock-' + Date.now() }
  }

  async sendBookingCancellationSms(phone: string, dateTime: string, bookingUrl: string): Promise<{ providerMessageId: string }> {
    console.log(`📱 Mock SMS sent to ${phone}: התור ל־${dateTime} בוטל לפי בקשתך. לקביעת תור חדש: ${bookingUrl}`)
    return { providerMessageId: 'mock-' + Date.now() }
  }
}

export class SmsService {
  private provider: SmsProvider
  private prisma: PrismaClient

  constructor(provider: SmsProvider, prisma: PrismaClient) {
    this.provider = provider
    this.prisma = prisma
  }

  async sendOtpSms(phone: string, code: string): Promise<{ providerMessageId: string }> {
    const text = `קוד האימות שלך הוא ${code}. תקף ל־5 דקות. אם לא ביקשת — התעלם.`
    return this.provider.sendSms({ toE164: phone, text })
  }

  async sendBookingConfirmationSms(phone: string, dateTime: string, manageUrl: string): Promise<{ providerMessageId: string }> {
    const text = `התור נקבע ל־${dateTime}. ניהול/ביטול: ${manageUrl}`
    return this.provider.sendSms({ toE164: phone, text })
  }

  async sendBookingCancellationSms(phone: string, dateTime: string, bookingUrl: string): Promise<{ providerMessageId: string }> {
    const text = `התור ל־${dateTime} בוטל לפי בקשתך. לקביעת תור חדש: ${bookingUrl}`
    return this.provider.sendSms({ toE164: phone, text })
  }
}

// Factory function to create SMS service
export function createSmsService(prisma: PrismaClient): SmsService {
  const config: SmsConfig = {
    baseUrl: process.env.INFOBIP_BASE_URL || 'https://69drj5.api.infobip.com',
    apiKey: process.env.INFOBIP_API_KEY || '',
    senderId: process.env.SMS_SENDER_ID || 'PadelPro'
  }

  if (!config.apiKey) {
    console.warn('INFOBIP_API_KEY not found, using mock SMS service')
    // Return a mock SMS service for development
    return new MockSmsService(prisma)
  }

  const provider = new InfobipSmsProvider(config)
  return new SmsService(provider, prisma)
}

