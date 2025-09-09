const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export interface Salon {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  images: string[]
  workingHours: Record<string, { start: string; end: string }>
  isActive: boolean
}

export interface Service {
  id: number
  name: string
  description: string
  duration: number
  price: number
  salonId: number
  isActive: boolean
}

export interface Booking {
  id: number
  dateTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  customerName: string
  customerPhone: string
  customerEmail: string
  notes?: string
  salonId: number
  serviceId: number
  salon?: Salon
  service?: Service
}

export interface TimeSlot {
  time: string
  available: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Salons
  async getSalons(): Promise<Salon[]> {
    return this.request<Salon[]>('/salons')
  }

  async getSalon(id: number): Promise<Salon> {
    return this.request<Salon>(`/salons/${id}`)
  }

  // Services
  async getServices(salonId: number): Promise<Service[]> {
    return this.request<Service[]>(`/salons/${salonId}/services`)
  }

  // Bookings
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    })
  }

  async getBookings(salonId: number, date: string): Promise<Booking[]> {
    return this.request<Booking[]>(`/bookings?salonId=${salonId}&date=${date}`)
  }

  async getAvailableTimeSlots(salonId: number, serviceId: number, date: string): Promise<TimeSlot[]> {
    return this.request<TimeSlot[]>(`/bookings/available?salonId=${salonId}&serviceId=${serviceId}&date=${date}`)
  }

  // OTP
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  }

  async verifyOtp(phone: string, code: string): Promise<{ success: boolean; manageUrl?: string }> {
    return this.request<{ success: boolean; manageUrl?: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    })
  }

  // Holds
  async createHold(data: {
    salonId: number
    serviceId: number
    dateTime: string
    customerName: string
    customerPhone: string
  }): Promise<{ holdId: string; expiresAt: string }> {
    return this.request<{ holdId: string; expiresAt: string }>('/holds', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
