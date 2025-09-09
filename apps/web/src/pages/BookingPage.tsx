import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { 
  Clock, 
  CheckCircle,
  ChevronRight
} from 'lucide-react'
import Header from '../components/Header'
import SendOtp from '../components/otp/SendOtp'
import OtpVerification from '../components/otp/OtpVerification'

interface TimeSlot {
  time: string
  available: boolean
  serviceId?: string
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
  barbers: string[] // Array of barber IDs who can perform this service
}

interface Barber {
  id: string
  name: string
  image: string
  specialties: string[]
  nextAvailableSlot: string
}

interface BookingData {
  serviceId: string
  date: string
  time: string
  customerName: string
  customerPhone: string
  customerEmail: string
  notes: string
}

interface HoldData {
  holdId: string
  salonId: string
  serviceId: string
  date: string
  time: string
}

const BookingPage = () => {
  const { salonId } = useParams()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [holdData, setHoldData] = useState<HoldData | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [manageUrl, setManageUrl] = useState('')
  const availableBarbersForTime = useMemo<Barber[]>(() => {
    if (selectedService && selectedTime) {
      return getAvailableBarbersForTime(selectedService, selectedTime)
    }
    return []
  }, [selectedService, selectedTime])
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: '',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  })

  // Mock barbers data
  const barbers: Barber[] = [
    { 
      id: '1', 
      name: 'דוד כהן', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      specialties: ['תספורת', 'זקן', 'חבילה'],
      nextAvailableSlot: 'מחר 14:30'
    },
    { 
      id: '2', 
      name: 'מיכאל לוי', 
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      specialties: ['תספורת', 'טיפוח'],
      nextAvailableSlot: 'היום 16:00'
    },
    { 
      id: '3', 
      name: 'יוסי ישראלי', 
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      specialties: ['זקן', 'חבילה'],
      nextAvailableSlot: 'מחר 10:00'
    }
  ]

  // Mock services data
  const services: Service[] = [
    { id: '1', name: 'תספורת גברים', price: 80, duration: 45, category: 'תספורת', barbers: ['1', '2'] },
    { id: '2', name: 'טיפוח זקן', price: 60, duration: 30, category: 'זקן', barbers: ['1', '3'] },
    { id: '3', name: 'תספורת + זקן', price: 120, duration: 75, category: 'חבילה', barbers: ['1', '3'] },
    { id: '4', name: 'שטיפת שיער', price: 30, duration: 15, category: 'טיפוח', barbers: ['2'] }
  ]

  // Generate time slots for selected date
  const generateTimeSlots = (_date: string) => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    const interval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // Mock availability - in real app this would come from API
        const available = Math.random() > 0.3
        slots.push({
          time: timeString,
          available,
          serviceId: selectedService?.id
        })
      }
    }

    setTimeSlots(slots)
  }

  // Get available barbers for selected service
  const getAvailableBarbers = (service: Service) => {
    return barbers.filter(barber => service.barbers.includes(barber.id))
  }

  // Get available barbers for a specific time slot
  const getAvailableBarbersForTime = (service: Service, time: string) => {
    const availableBarbers = getAvailableBarbers(service)
    if (time === '14:30') return availableBarbers
    if (time === '16:00') return availableBarbers.slice(0, 2)
    return availableBarbers.slice(0, 1)
  }

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setBookingData(prev => ({ ...prev, serviceId: service.id }))
    
    const availableBarbers = getAvailableBarbers(service)
    if (availableBarbers.length > 1) {
      setCurrentStep(2) // Go to barber selection
    } else if (availableBarbers.length === 1) {
      setSelectedBarber(availableBarbers[0])
      setCurrentStep(3) // Skip barber selection, go to date/time
    } else {
      setCurrentStep(3) // No barbers available, go to date/time
    }
  }

  // Handle barber selection
  const handleBarberSelect = (barber: Barber | null) => {
    setSelectedBarber(barber)
    setCurrentStep(3) // Go to date/time selection
  }

  // (Removed unused: handleBarberSelectForTime)

  // Handle continue to customer details
  const handleContinueToCustomer = () => {
    if (selectedTime && availableBarbersForTime.length > 0) {
      // If no barber selected, select the first available one
      if (!selectedBarber && availableBarbersForTime.length > 0) {
        setSelectedBarber(availableBarbersForTime[0])
      }
    }
    setCurrentStep(4)
  }

  // (Removed unused: handleDateSelect)

  // (Removed unused: handleTimeSelect)

  // Handle form input changes
  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  // Create hold for booking slot
  const createHold = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !salonId) return

    try {
      const response = await fetch('/api/hold/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salonId,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone
        })
      })

      const data = await response.json()

      if (data.success) {
        setHoldData({
          holdId: data.holdId,
          salonId,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime
        })
        setCurrentStep(6) // Go to OTP step
      } else {
        alert(data.message || 'שגיאה ביצירת ההזמנה')
      }
    } catch (error) {
      console.error('Create hold error:', error)
      alert('שגיאה בחיבור לשרת')
    }
  }

  // Handle booking submission
  const handleBookingSubmit = () => {
    createHold()
  }

  // Handle OTP sent
  const handleOtpSent = () => {
    setOtpSent(true)
  }

  // Handle OTP verification success
  const handleOtpSuccess = (url: string) => {
    setManageUrl(url)
    setCurrentStep(7) // Success step
  }

  // Handle back from OTP
  const handleOtpBack = () => {
    setOtpSent(false)
    setCurrentStep(4) // Back to customer details
  }

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    return dates
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Check if service is pre-selected from URL
  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (serviceId) {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        setSelectedService(service)
        setBookingData(prev => ({ ...prev, serviceId: service.id }))
        setCurrentStep(2)
      }
    }
  }, [searchParams])

  const steps = [
    { number: 1, title: 'בחר שירות', description: 'בחר את השירות הרצוי' },
    { number: 2, title: 'בחר ספר', description: 'בחר את הספר המועדף' },
    { number: 3, title: 'בחר תאריך ושעה', description: 'בחר תאריך ושעה פנויים' },
    { number: 4, title: 'פרטי הלקוח', description: 'הזן את פרטי הלקוח' },
    { number: 5, title: 'אישור', description: 'אשר את ההזמנה' }
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <Header 
        title="הזמנת תור" 
        showBackButton={true}
        currentPage="bookings"
      />

      {/* Progress Steps */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-shrink-0">
                <div className="flex items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    currentStep >= step.number 
                      ? 'bg-primary text-onPrimary' 
                      : 'bg-surface border border-border text-muted'
                  }`}>
                    {currentStep > step.number ? <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5" /> : step.number}
                  </div>
                  <div className="mr-2 sm:mr-3 rtl:ml-2 sm:rtl:ml-3 hidden sm:block">
                    <p className={`text-xs sm:text-sm font-medium ${
                      currentStep >= step.number ? 'text-primary' : 'text-text'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-muted mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text">בחר את השירות הרצוי</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleServiceSelect(service)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text pr-2">{service.name}</h3>
                    <span className="bg-accent text-onAccent px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      {service.category}
                    </span>
                  </div>
                  
                  {/* Service Provider Info */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse min-w-0 flex-1">
                      {getAvailableBarbers(service).length > 0 ? (
                        <>
                          <img 
                            src={getAvailableBarbers(service)[0].image} 
                            alt={getAvailableBarbers(service)[0].name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-text truncate">{getAvailableBarbers(service)[0].name}</p>
                            <p className="text-xs text-muted truncate">התור הקרוב: {getAvailableBarbers(service)[0].nextAvailableSlot}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-hover rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-muted font-semibold text-xs sm:text-sm">?</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-text">אין ספר זמין</p>
                            <p className="text-xs text-muted">נא ליצור קשר</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-2xl font-bold text-primary">
                        ₪{service.price}
                      </div>
                      <div className="flex items-center text-muted text-xs sm:text-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 rtl:mr-1" />
                        <span>{service.duration} דקות</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Book Button */}
                  <button 
                    className="w-full bg-primary text-onPrimary py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleServiceSelect(service)
                    }}
                  >
                    בחר שירות זה
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Barber Selection */}
        {currentStep === 2 && selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">בחר ספר</h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-muted hover:text-primary transition-colors flex items-center"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 rtl:mr-1" />
                <span className="hidden sm:inline">חזור</span>
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-base sm:text-lg text-muted">בחר ספר:</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {getAvailableBarbers(selectedService).map((barber) => (
                <motion.div
                  key={barber.id}
                  className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleBarberSelect(barber)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <img 
                      src={barber.image} 
                      alt={barber.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 sm:mb-4"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-text mb-2">{barber.name}</h3>
                    <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">התור הקרוב: {barber.nextAvailableSlot}</p>
                    
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {barber.specialties.map((specialty) => (
                        <span 
                          key={specialty}
                          className="bg-warning/20 text-warning px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <button 
                      className="w-full bg-primary text-onPrimary py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBarberSelect(barber)
                      }}
                    >
                      בחר ספר זה
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {/* No Preference Option - Last in grid */}
              <motion.div
                key="no-preference"
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSelectedBarber(null)
                  setCurrentStep(3)
                }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-warning/20 to-warning/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-warning/40">
                    <span className="text-2xl sm:text-3xl">🎯</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text mb-2">אין לי העדפה</h3>
                  <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">המערכת תבחר את הספר הזמין ביותר</p>
                  
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <span className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs font-medium">
                      אוטומטי
                    </span>
                    <span className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs font-medium">
                      זמין
                    </span>
                  </div>
                  
                  <button 
                    className="w-full bg-primary text-onPrimary py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedBarber(null)
                      setCurrentStep(3)
                    }}
                  >
                    בחר ספר זה
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Date and Time Selection */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-text">בחר תאריך ושעה</h2>
                {selectedBarber ? (
                  <div className="flex items-center mt-2 space-x-2 sm:space-x-3 rtl:space-x-reverse">
                    <img 
                      src={selectedBarber.image} 
                      alt={selectedBarber.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-sm sm:text-base text-muted truncate">עם {selectedBarber.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center mt-2 space-x-2 sm:space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-warning/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">🎯</span>
                    </div>
                    <span className="text-sm sm:text-base text-muted truncate">המערכת תבחר את הספר הזמין ביותר</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCurrentStep(selectedService && getAvailableBarbers(selectedService).length > 1 ? 2 : 1)}
                className="text-muted hover:text-primary transition-colors flex items-center flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 rtl:mr-1" />
                <span className="hidden sm:inline">חזור</span>
              </button>
            </div>
            
            {/* Quick Book - Next Available Slot */}
            <div className="mb-6 sm:mb-8">
              <motion.button
                className="w-full bg-primary text-onPrimary rounded-2xl p-4 sm:p-6 hover:bg-primary/90 transition-all duration-300 font-semibold text-base sm:text-lg min-h-[44px] flex items-center justify-center"
                onClick={() => {
                  // Set to tomorrow at 14:30 as example
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  const dateStr = tomorrow.toISOString().split('T')[0]
                  setSelectedDate(dateStr)
                  setSelectedTime('14:30')
                  setBookingData(prev => ({ ...prev, date: dateStr, time: '14:30' }))
                  setCurrentStep(3)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>התור הקרוב ביותר - מחר 14:30</span>
                </div>
              </motion.button>
            </div>
            
            {/* Date Selection */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4">בחר תאריך</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                {getAvailableDates().map((date) => (
                  <motion.button
                    key={date}
                    className={`border rounded-xl sm:rounded-2xl shadow-sm p-2 sm:p-4 transition-all duration-300 text-center min-h-[44px] flex flex-col justify-center ${
                      selectedDate === date 
                        ? 'bg-primary text-onPrimary border-primary' 
                        : 'bg-surface border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedDate(date)
                      generateTimeSlots(date)
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">
                      {new Date(date).toLocaleDateString('he-IL', { weekday: 'short' })}
                    </div>
                    <div className="text-sm sm:text-lg font-semibold">
                      {new Date(date).getDate()}
                    </div>
                    <div className="text-xs text-muted hidden sm:block">
                      {new Date(date).toLocaleDateString('he-IL', { month: 'short' })}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4">בחר שעה</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.time}
                      className={`border rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-300 min-h-[44px] flex items-center justify-center ${
                        slot.available
                          ? selectedTime === slot.time
                            ? 'bg-primary text-onPrimary border-primary'
                            : 'bg-surface border-border hover:border-primary/50'
                          : 'bg-surface-hover border-border text-muted/60 cursor-not-allowed'
                      }`}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      whileHover={slot.available ? { y: -2 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                    >
                      <span className="text-xs sm:text-sm">{slot.time}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Selected Barber Summary */}
                {selectedTime && selectedBarber && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-text mb-4">התור שלך</h3>
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 max-w-md mx-auto">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <img 
                          src={selectedBarber.image} 
                          alt={selectedBarber.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-text">{selectedBarber.name}</h4>
                          <p className="text-sm text-muted">
                            {formatDate(selectedDate)} בשעה {selectedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Barber Selection for Selected Time */}
                {selectedTime && availableBarbersForTime.length > 0 && !selectedBarber && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-text mb-4">
                      בחר ספר לשעה {selectedTime}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {availableBarbersForTime.map((barber) => (
                        <motion.div
                          key={barber.id}
                          className="bg-surface border border-border rounded-xl shadow-sm p-4 transition-all duration-300 cursor-pointer group hover:border-primary/50 hover:shadow-md"
                          onClick={() => setSelectedBarber(barber)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img 
                              src={barber.image} 
                              alt={barber.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-text">{barber.name}</h4>
                              <p className="text-sm text-muted">זמין בשעה {selectedTime}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {barber.specialties.slice(0, 2).map((specialty) => (
                                  <span 
                                    key={specialty}
                                    className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* No Preference Option */}
                      <motion.div
                        className="bg-surface border border-border rounded-xl shadow-sm p-4 transition-all duration-300 cursor-pointer group hover:border-primary/50 hover:shadow-md"
                        onClick={() => setSelectedBarber(null)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/30 rounded-full flex items-center justify-center border-2 border-warning/40">
                            <span className="text-xl">🎯</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-text">אין לי העדפה</h4>
                            <p className="text-sm text-muted">המערכת תבחר ספר זמין</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs">
                                אוטומטי
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="mt-6 text-center">
                    <button
                      className="bg-primary text-onPrimary px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
                      onClick={handleContinueToCustomer}
                    >
                      המשך לפרטי הלקוח
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}


        {/* Step 4: Customer Details */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">פרטי הלקוח</h2>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-muted hover:text-primary transition-colors flex items-center"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 rtl:mr-1" />
                <span className="hidden sm:inline">חזור</span>
              </button>
            </div>
            
            <div className="max-w-2xl">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="הזן את השם המלא"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    מספר טלפון *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 sm:px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                    value={bookingData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="050-1234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    כתובת אימייל
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 sm:px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                    value={bookingData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    הערות נוספות
                  </label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                    value={bookingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="הערות מיוחדות או בקשות..."
                  />
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-surface border border-border rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-text">סיכום ההזמנה</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-muted">שירות:</span>
                    <span className="text-sm sm:text-base text-text">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-muted">תאריך:</span>
                    <span className="text-sm sm:text-base text-text">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-muted">שעה:</span>
                    <span className="text-sm sm:text-base text-text">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold border-t border-border pt-2">
                    <span className="text-text">סה"כ:</span>
                    <span className="text-primary">₪{selectedService?.price}</span>
                  </div>
                </div>
              </div>
              
              <button
                className="bg-primary text-onPrimary rounded-xl w-full mt-4 sm:mt-6 text-base sm:text-lg py-3 sm:py-4 hover:opacity-90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
                onClick={handleBookingSubmit}
                disabled={!bookingData.customerName || !bookingData.customerPhone}
              >
                <CheckCircle className="w-5 h-5 ml-2 rtl:mr-2" />
                אשר הזמנה
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 6: Send OTP */}
        {currentStep === 6 && !otpSent && holdData && (
          <SendOtp
            customerName={bookingData.customerName}
            customerPhone={bookingData.customerPhone}
            holdId={holdData.holdId}
            onOtpSent={handleOtpSent}
            onBack={handleOtpBack}
          />
        )}

        {/* Step 6.5: Verify OTP */}
        {currentStep === 6 && otpSent && holdData && (
          <OtpVerification
            phone={bookingData.customerPhone}
            customerName={bookingData.customerName}
            holdId={holdData.holdId}
            onSuccess={handleOtpSuccess}
            onBack={handleOtpBack}
            onResend={handleOtpSent}
          />
        )}

        {/* Step 7: Success with Management Link */}
        {currentStep === 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-onPrimary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-text">התור נקבע בהצלחה!</h2>
            <p className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 px-4">
              נשלח לך הודעת אישור ב-SMS עם קישור לניהול התור
            </p>
            <div className="max-w-md mx-auto bg-surface border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-text">פרטי ההזמנה</h3>
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">שירות:</span>
                  <span className="text-sm sm:text-base text-text">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">תאריך:</span>
                  <span className="text-sm sm:text-base text-text">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">שעה:</span>
                  <span className="text-sm sm:text-base text-text">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">מחיר:</span>
                  <span className="text-sm sm:text-base text-primary">₪{selectedService?.price}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                className="w-full sm:w-auto bg-primary text-onPrimary rounded-xl px-4 sm:px-6 py-3 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                onClick={() => window.open(manageUrl, '_blank')}
              >
                ניהול התור
              </button>
              <button
                className="w-full sm:w-auto border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-onPrimary rounded-xl px-4 sm:px-6 py-3 transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                onClick={() => window.location.href = `/salon/${salonId}`}
              >
                חזור למספרה
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Success (Legacy) */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-onPrimary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-text">ההזמנה בוצעה בהצלחה!</h2>
            <p className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 px-4">
              קיבלת הודעת אישור במייל ובטלפון
            </p>
            <div className="max-w-md mx-auto bg-surface border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-text">פרטי ההזמנה</h3>
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">שירות:</span>
                  <span className="text-sm sm:text-base text-text">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">תאריך:</span>
                  <span className="text-sm sm:text-base text-text">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">שעה:</span>
                  <span className="text-sm sm:text-base text-text">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">ספר:</span>
                  <span className="text-sm sm:text-base text-text">
                    {selectedBarber ? selectedBarber.name : 'המערכת תבחר את הספר הזמין ביותר'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-muted">מחיר:</span>
                  <span className="text-sm sm:text-base text-primary">₪{selectedService?.price}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                className="w-full sm:w-auto bg-primary text-onPrimary rounded-xl px-4 sm:px-6 py-3 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                onClick={() => window.location.href = `/salon/${salonId}`}
              >
                חזור למספרה
              </button>
              <button
                className="w-full sm:w-auto border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-onPrimary rounded-xl px-4 sm:px-6 py-3 transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                onClick={() => window.location.href = '/'}
              >
                דף הבית
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
