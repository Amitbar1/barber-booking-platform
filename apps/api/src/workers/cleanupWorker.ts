import { PrismaClient } from '@prisma/client'
import { OtpService } from '../services/otpService.js'
import { HoldService } from '../services/holdService.js'

export class CleanupWorker {
  private prisma: PrismaClient
  private otpService: OtpService
  private holdService: HoldService
  private intervalId: NodeJS.Timeout | null = null

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.otpService = new OtpService(prisma)
    this.holdService = new HoldService(prisma)
  }

  // Start the cleanup worker
  start(intervalMinutes: number = 1): void {
    console.log(`🧹 Starting cleanup worker (every ${intervalMinutes} minute(s))`)
    
    this.intervalId = setInterval(async () => {
      try {
        await this.cleanup()
      } catch (error) {
        console.error('Cleanup worker error:', error)
      }
    }, intervalMinutes * 60 * 1000)

    // Run cleanup immediately
    this.cleanup()
  }

  // Stop the cleanup worker
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('🧹 Cleanup worker stopped')
    }
  }

  // Perform cleanup tasks
  private async cleanup(): Promise<void> {
    const startTime = Date.now()
    let cleanedOtps = 0
    let cleanedHolds = 0

    try {
      // Clean up expired OTP codes
      const otpResult = await this.prisma.otpCode.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isUsed: true }
          ]
        }
      })
      cleanedOtps = otpResult.count

      // Clean up expired holds
      const holdResult = await this.prisma.bookingHold.updateMany({
        where: {
          status: 'RESERVED',
          expiresAt: {
            lt: new Date()
          }
        },
        data: {
          status: 'EXPIRED'
        }
      })
      cleanedHolds = holdResult.count

      // Clean up expired manage tokens
      const tokenResult = await this.prisma.manageToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      const duration = Date.now() - startTime
      console.log(`🧹 Cleanup completed in ${duration}ms: ${cleanedOtps} OTPs, ${cleanedHolds} holds, ${tokenResult.count} tokens`)
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }

  // Manual cleanup trigger
  async runCleanup(): Promise<void> {
    console.log('🧹 Running manual cleanup...')
    await this.cleanup()
  }
}

// Export singleton instance
let cleanupWorker: CleanupWorker | null = null

export function getCleanupWorker(prisma: PrismaClient): CleanupWorker {
  if (!cleanupWorker) {
    cleanupWorker = new CleanupWorker(prisma)
  }
  return cleanupWorker
}
