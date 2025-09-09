import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  Phone,
  X,
  Navigation,
  AlertCircle
} from 'lucide-react'
import { useLocation } from '../hooks/useLocation'

interface Salon {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  reviewCount: number
  image: string
  services: string[]
  phone: string
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
}

interface SalonSearchProps {
  onSalonSelect?: (salon: Salon) => void
  showFilters?: boolean
}

const SalonSearch = ({ onSalonSelect, showFilters = true }: SalonSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [maxDistance, setMaxDistance] = useState<number>(10)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<Salon[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)

  // Location hook
  const {
    location: currentLocation,
    error: locationError,
    isLoading: locationLoading,
    isSupported,
    getCurrentLocation,
    calculateDistance
  } = useLocation()

  // Mock data - in real app this would come from API
  const allSalons: Salon[] = [
    {
      id: '1',
      name: 'מספרת דוד',
      address: 'רחוב הרצל 15, תל אביב',
      distance: '0.5 ק"מ',
      rating: 4.8,
      reviewCount: 127,
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
      services: ['תספורת', 'זקן', 'חבילה'],
      phone: '03-1234567',
      workingHours: {
        'ראשון': { open: '09:00', close: '18:00', closed: false },
        'שני': { open: '09:00', close: '18:00', closed: false },
        'שלישי': { open: '09:00', close: '18:00', closed: false },
        'רביעי': { open: '09:00', close: '18:00', closed: false },
        'חמישי': { open: '09:00', close: '18:00', closed: false },
        'שישי': { open: '09:00', close: '14:00', closed: false },
        'שבת': { open: '00:00', close: '00:00', closed: true }
      }
    },
    {
      id: '2',
      name: 'סטייליסט',
      address: 'רחוב דיזנגוף 25, תל אביב',
      distance: '1.2 ק"מ',
      rating: 4.6,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
      services: ['תספורת', 'טיפוח'],
      phone: '03-2345678',
      workingHours: {
        'ראשון': { open: '10:00', close: '19:00', closed: false },
        'שני': { open: '10:00', close: '19:00', closed: false },
        'שלישי': { open: '10:00', close: '19:00', closed: false },
        'רביעי': { open: '10:00', close: '19:00', closed: false },
        'חמישי': { open: '10:00', close: '19:00', closed: false },
        'שישי': { open: '10:00', close: '15:00', closed: false },
        'שבת': { open: '00:00', close: '00:00', closed: true }
      }
    },
    {
      id: '3',
      name: 'מספרת יוסי',
      address: 'רחוב אלנבי 8, תל אביב',
      distance: '0.8 ק"מ',
      rating: 4.9,
      reviewCount: 203,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      services: ['זקן', 'חבילה'],
      phone: '03-3456789',
      workingHours: {
        'ראשון': { open: '08:00', close: '17:00', closed: false },
        'שני': { open: '08:00', close: '17:00', closed: false },
        'שלישי': { open: '08:00', close: '17:00', closed: false },
        'רביעי': { open: '08:00', close: '17:00', closed: false },
        'חמישי': { open: '08:00', close: '17:00', closed: false },
        'שישי': { open: '08:00', close: '13:00', closed: false },
        'שבת': { open: '00:00', close: '00:00', closed: true }
      }
    },
    {
      id: '4',
      name: 'מספרת אלון',
      address: 'רחוב רוטשילד 45, תל אביב',
      distance: '1.5 ק"מ',
      rating: 4.7,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1521590832167-8b6316e0c6e7?w=400',
      services: ['תספורת', 'זקן', 'חבילה', 'טיפוח'],
      phone: '03-4567890',
      workingHours: {
        'ראשון': { open: '09:30', close: '18:30', closed: false },
        'שני': { open: '09:30', close: '18:30', closed: false },
        'שלישי': { open: '09:30', close: '18:30', closed: false },
        'רביעי': { open: '09:30', close: '18:30', closed: false },
        'חמישי': { open: '09:30', close: '18:30', closed: false },
        'שישי': { open: '09:30', close: '15:30', closed: false },
        'שבת': { open: '00:00', close: '00:00', closed: true }
      }
    }
  ]

  const availableServices = ['תספורת', 'זקן', 'חבילה', 'טיפוח', 'שטיפת שיער']

  // Filter salons based on search criteria
  const filterSalons = () => {
    let filtered = allSalons

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(salon => 
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(salon => 
        salon.address.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Filter by services
    if (selectedServices.length > 0) {
      filtered = filtered.filter(salon => 
        selectedServices.every(service => salon.services.includes(service))
      )
    }

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(salon => salon.rating >= selectedRating)
    }

    // Filter by distance if using current location
    if (useCurrentLocation && currentLocation) {
      filtered = filtered.filter(salon => {
        // Mock coordinates for demonstration - in real app these would come from database
        const salonCoords = getSalonCoordinates(salon.id)
        if (salonCoords) {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            salonCoords.lat,
            salonCoords.lng
          )
          return distance <= maxDistance
        }
        return true
      })
    }

    return filtered
  }

  // Mock function to get salon coordinates - in real app this would come from database
  const getSalonCoordinates = (salonId: string) => {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      '1': { lat: 32.0853, lng: 34.7818 }, // Tel Aviv
      '2': { lat: 32.0668, lng: 34.7778 }, // Tel Aviv
      '3': { lat: 32.0599, lng: 34.7856 }, // Tel Aviv
      '4': { lat: 32.0671, lng: 34.7642 }, // Tel Aviv
    }
    return coordinates[salonId]
  }

  // Perform search
  const handleSearch = async () => {
    setIsSearching(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const results = filterSalons()
    setSearchResults(results)
    setIsSearching(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setLocation('')
    setSelectedServices([])
    setSelectedRating(0)
    setMaxDistance(10)
    setSearchResults([])
  }

  // Toggle service selection
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  // Get current day working hours
  const getCurrentDayHours = (salon: Salon) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    const today = new Date().getDay()
    const dayName = days[today]
    const hours = salon.workingHours[dayName]
    
    if (hours?.closed) return 'סגור היום'
    if (hours) return `${hours.open} - ${hours.close}`
    return 'שעות לא זמינות'
  }

  // Check if salon is currently open
  const isSalonOpen = (salon: Salon) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    const today = new Date().getDay()
    const dayName = days[today]
    const hours = salon.workingHours[dayName]
    
    if (hours?.closed) return false
    
    if (hours) {
      const now = new Date()
      const currentTime = now.getHours() * 100 + now.getMinutes()
      const openTime = parseInt(hours.open.replace(':', ''))
      const closeTime = parseInt(hours.close.replace(':', ''))
      
      return currentTime >= openTime && currentTime <= closeTime
    }
    
    return false
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-surface border border-border rounded-2xl shadow-lg p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-6 text-center">חפש מספרה קרובה</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">חיפוש</label>
              <div className="relative">
                <Search className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="שם המספרה או שירות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">מיקום</label>
              <div className="relative">
                <MapPin className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder={useCurrentLocation ? "משתמש במיקום הנוכחי" : "עיר או כתובת..."}
                  value={useCurrentLocation ? (currentLocation?.address || "משתמש במיקום הנוכחי") : location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={useCurrentLocation}
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={async () => {
                    if (useCurrentLocation) {
                      setUseCurrentLocation(false)
                      setLocation('')
                    } else {
                      try {
                        await getCurrentLocation()
                        setUseCurrentLocation(true)
                        setLocation('')
                      } catch (error) {
                        console.error('Failed to get location:', error)
                      }
                    }
                  }}
                  disabled={locationLoading || !isSupported}
                  className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {locationLoading ? (
                    <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin" />
                  ) : useCurrentLocation ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                </button>
              </div>
              {useCurrentLocation && currentLocation && (
                <p className="text-xs text-success mt-1 flex items-center">
                  <Navigation className="w-3 h-3 ml-1 rtl:mr-1" />
                  מיקום נוכחי: {currentLocation.address || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                </p>
              )}
              {locationError && (
                <p className="text-xs text-error mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 ml-1 rtl:mr-1" />
                  {locationError.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-primary text-onPrimary rounded-xl px-6 py-3 text-base font-medium hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center disabled:opacity-50"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2 rtl:mr-2" />
              ) : (
                <Search className="w-5 h-5 ml-2 rtl:mr-2" />
              )}
              {isSearching ? 'מחפש...' : 'חפש מספרות'}
            </button>
            
            {showFilters && (
              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex-1 border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-onPrimary rounded-xl px-6 py-3 text-base font-medium transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
              >
                <Filter className="w-5 h-5 ml-2 rtl:mr-2" />
                סינון מתקדם
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface border border-border rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">סינון מתקדם</h3>
            <button
              onClick={clearFilters}
              className="text-muted hover:text-text text-sm flex items-center"
            >
              <X className="w-4 h-4 ml-1 rtl:mr-1" />
              נקה הכל
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Services Filter */}
            <div>
              <label className="block text-sm font-medium text-text mb-3">שירותים</label>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedServices.includes(service)
                        ? 'bg-primary text-onPrimary'
                        : 'bg-surface border border-border text-text hover:bg-surface-hover'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-text mb-3">דירוג מינימלי</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRating >= rating
                        ? 'bg-primary text-onPrimary'
                        : 'bg-surface border border-border text-text hover:bg-surface-hover'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                מרחק מקסימלי: {maxDistance} ק"מ
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-2 bg-surface border border-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">
              נמצאו {searchResults.length} מספרות
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((salon, index) => (
              <motion.div
                key={salon.id}
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => onSalonSelect?.(salon)}
              >
                <div className="relative mb-4">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 rtl:left-2 bg-primary text-onPrimary px-2 py-1 rounded text-xs font-semibold">
                    {salon.distance}
                  </div>
                  <div className={`absolute top-2 left-2 rtl:right-2 px-2 py-1 rounded text-xs font-semibold ${
                    isSalonOpen(salon) 
                      ? 'bg-success text-success-text' 
                      : 'bg-error text-error-text'
                  }`}>
                    {isSalonOpen(salon) ? 'פתוח' : 'סגור'}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-text">{salon.name}</h3>
                <p className="text-sm text-muted mb-3 flex items-center">
                  <MapPin className="w-4 h-4 ml-1 rtl:mr-1" />
                  {salon.address}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-primary fill-current ml-1 rtl:mr-1" />
                    <span className="text-sm font-semibold text-text">{salon.rating}</span>
                    <span className="text-xs text-muted mr-2 rtl:ml-2">({salon.reviewCount})</span>
                  </div>
                  <div className="flex items-center text-muted text-xs">
                    <Clock className="w-3 h-3 ml-1 rtl:mr-1" />
                    {getCurrentDayHours(salon)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {salon.services.map((service) => (
                    <span 
                      key={service}
                      className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="flex-1 bg-primary text-onPrimary py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    הזמן תור
                  </button>
                  <button className="ml-2 rtl:mr-2 p-2 text-muted hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">לא נמצאו מספרות</h3>
          <p className="text-muted mb-4">נסה לשנות את מילות החיפוש או הסינון</p>
          <button
            onClick={clearFilters}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            נקה את כל הסינונים
          </button>
        </div>
      )}
    </div>
  )
}

export default SalonSearch
