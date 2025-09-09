import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Camera,
  ChevronRight,
  CheckCircle,
  X
} from 'lucide-react'
import Header from '../components/Header'
import { useSalonTheme } from '../hooks/useSalonTheme'
import LazyImage from '../components/LazyImage'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  images: string[]
  category: string
}

interface Salon {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  rating: number
  reviewCount: number
  images: string[]
  services: Service[]
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
}

const SalonPage = () => {
  const { salonId } = useParams()
  const [salon, setSalon] = useState<Salon | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Load salon theme
  const { theme, isLoading: themeLoading } = useSalonTheme(salonId)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockSalon: Salon = {
      id: salonId || '1',
      name: 'מספרת דוד - סגנון גברים',
      description: 'מספרה מקצועית לגברים עם שירותים מתקדמים וצוות מנוסה. אנו מתמחים בתספורות קלאסיות ומודרניות, טיפוח זקן ושירותי יופי לגברים.',
      address: 'רחוב הרצל 15, תל אביב',
      phone: '03-1234567',
      email: 'info@david-barber.co.il',
      rating: 4.8,
      reviewCount: 127,
      images: [
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
        'https://images.unsplash.com/photo-1521590832167-8b6316e0c6e7?w=800'
      ],
      services: [
        {
          id: '1',
          name: 'תספורת גברים',
          description: 'תספורת מקצועית עם מכונת תספורת וזוג מספריים',
          price: 80,
          duration: 45,
          images: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400'],
          category: 'תספורת'
        },
        {
          id: '2',
          name: 'טיפוח זקן',
          description: 'גזירת זקן, עיצוב וטיפוח עם מוצרים איכותיים',
          price: 60,
          duration: 30,
          images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'],
          category: 'זקן'
        },
        {
          id: '3',
          name: 'תספורת + זקן',
          description: 'חבילת שירותים מלאה - תספורת וטיפוח זקן',
          price: 120,
          duration: 75,
          images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'],
          category: 'חבילה'
        },
        {
          id: '4',
          name: 'שטיפת שיער',
          description: 'שטיפת שיער מקצועית עם שמפו איכותי',
          price: 30,
          duration: 15,
          images: ['https://images.unsplash.com/photo-1521590832167-8b6316e0c6e7?w=400'],
          category: 'טיפוח'
        }
      ],
      workingHours: {
        'ראשון': { open: '09:00', close: '18:00', closed: false },
        'שני': { open: '09:00', close: '18:00', closed: false },
        'שלישי': { open: '09:00', close: '18:00', closed: false },
        'רביעי': { open: '09:00', close: '18:00', closed: false },
        'חמישי': { open: '09:00', close: '18:00', closed: false },
        'שישי': { open: '09:00', close: '14:00', closed: false },
        'שבת': { open: '00:00', close: '00:00', closed: true }
      }
    }
    
    setTimeout(() => {
      setSalon(mockSalon)
      setIsLoading(false)
    }, 1000)
  }, [salonId])

  if (isLoading || themeLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">המספרה לא נמצאה</h1>
          <p className="text-muted">אנא בדוק את הכתובת ונסה שוב</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <Header 
        title="המספרה" 
        showBackButton={true}
        currentPage="salon"
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-r from-surface to-surface/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="px-4"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-4">
                  {theme.brandLogo && (
                    <img 
                      src={theme.brandLogo} 
                      alt="Salon Logo" 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                    />
                  )}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text leading-tight">{salon.name}</h1>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-muted mb-4 sm:mb-6 max-w-2xl">{salon.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-current ml-1 rtl:mr-1" />
                    <span className="text-base sm:text-lg font-semibold text-text">{salon.rating}</span>
                    <span className="text-sm sm:text-base text-muted mr-2 rtl:ml-2">({salon.reviewCount} ביקורות)</span>
                  </div>
                  <div className="flex items-center text-muted">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 ml-1 rtl:mr-1" />
                    <span className="text-sm sm:text-base">{salon.address}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            גלריית תמונות
          </motion.h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {salon.images.map((image, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {/* Handle image selection */}}
              >
                <LazyImage
                  src={image}
                  alt={`${salon.name} - תמונה ${index + 1}`}
                  className="w-full h-32 sm:h-40 md:h-48 rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-primary-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            השירותים שלנו
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {salon.services.map((service) => (
              <motion.div
                key={service.id}
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                onClick={() => setSelectedService(service)}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-3 sm:mb-4">
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 rtl:left-2 bg-primary text-onPrimary px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                    {service.category}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-text">{service.name}</h3>
                <p className="text-sm sm:text-base text-muted mb-3 sm:mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center text-muted text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 rtl:mr-1" />
                      <span>{service.duration} דקות</span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-primary">
                      ₪{service.price}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            פרטי יצירת קשר
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-text">טלפון</h3>
                  <p className="text-sm sm:text-base text-muted break-all">{salon.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-text">אימייל</h3>
                  <p className="text-sm sm:text-base text-muted break-all">{salon.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-text">כתובת</h3>
                  <p className="text-sm sm:text-base text-muted">{salon.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">שעות פעילות</h3>
              <div className="space-y-2">
                {Object.entries(salon.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-sm sm:text-base text-muted">{day}</span>
                    <span className={`text-sm sm:text-base ${hours.closed ? 'text-error' : 'text-text'}`}>
                      {hours.closed ? 'סגור' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Booking Button */}
          <div className="mt-6 sm:mt-8">
            <motion.button
              className="w-full bg-primary text-onPrimary rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg hover:opacity-90 focus:ring-2 focus:ring-primary/50 font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] flex items-center justify-center"
              onClick={() => window.location.href = `/booking/${salonId}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-5 h-5 ml-2 rtl:mr-2" />
              קביעת תור מהירה
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-primary/10" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-text">מוכן להזמין תור?</h2>
            <p className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 px-4">
              בחר את השירות שלך והזמן תור בקלות ובמהירות
            </p>
            <button 
              className="bg-primary text-onPrimary rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:opacity-90 focus:ring-2 focus:ring-primary/50 font-semibold min-h-[44px] flex items-center justify-center mx-auto"
              onClick={() => window.location.href = `/booking/${salonId}`}
            >
              <Calendar className="w-5 h-5 ml-2 rtl:mr-2" />
              הזמן תור עכשיו
            </button>
          </motion.div>
        </div>
      </section>

      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <motion.div
            className="bg-surface border border-border rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-text pr-2">{selectedService.name}</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-muted hover:text-text w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover transition-colors"
                aria-label="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <img
              src={selectedService.images[0]}
              alt={selectedService.name}
              className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
            />
            
            <p className="text-sm sm:text-base text-muted mb-4">{selectedService.description}</p>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                <div className="flex items-center text-muted text-sm sm:text-base">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 rtl:mr-1" />
                  <span>{selectedService.duration} דקות</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-primary">
                  ₪{selectedService.price}
                </div>
              </div>
            </div>
            
            <button 
              className="bg-primary text-onPrimary rounded-xl w-full px-4 py-3 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
              onClick={() => {
                setSelectedService(null)
                window.location.href = `/booking/${salonId}?service=${selectedService.id}`
              }}
            >
              <CheckCircle className="w-5 h-5 ml-2 rtl:mr-2" />
              בחר שירות זה
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SalonPage
