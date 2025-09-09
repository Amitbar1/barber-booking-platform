import { Booking, ManageToken } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      prisma?: any
      user?: {
        id: string
        email: string
        role: string
        salonId?: string
      }
      manageToken?: ManageToken & {
        booking: Booking & {
          salon: any
          service: any
          customer: any
        }
      }
      booking?: Booking & {
        salon: any
        service: any
        customer: any
      }
      io?: any
    }
  }
}

export {}
