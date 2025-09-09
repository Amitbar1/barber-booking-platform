import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  Phone,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react'
import Header from '../components/Header'
import SalonSearch from '../components/SalonSearch'

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
  priceRange: string
  description: string
}

type ViewMode = 'grid' | 'list'
type SortBy = 'distance' | 'rating' | 'name' | 'price'
type SortOrder = 'asc' | 'desc'

const SalonListingPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('distance')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [allSalons, setAllSalons] = useState<Salon[]>([])
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockSalons: Salon[] = [
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
        priceRange: '₪60-120',
        description: 'מספרה מקצועית לגברים עם שירותים מתקדמים וצוות מנוסה',
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
        priceRange: '₪50-100',
        description: 'סטייליסט מקצועי עם ניסיון של 15 שנה',
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
        priceRange: '₪70-130',
        description: 'מספרה קלאסית עם אווירה חמימה ומקצועית',
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
        priceRange: '₪80-150',
        description: 'מספרה מודרנית עם שירותים מתקדמים',
        workingHours: {
          'ראשון': { open: '09:30', close: '18:30', closed: false },
          'שני': { open: '09:30', close: '18:30', closed: false },
          'שלישי': { open: '09:30', close: '18:30', closed: false },
          'רביעי': { open: '09:30', close: '18:30', closed: false },
          'חמישי': { open: '09:30', close: '18:30', closed: false },
          'שישי': { open: '09:30', close: '15:30', closed: false },
          'שבת': { open: '00:00', close: '00:00', closed: true }
        }
      },
      {
        id: '5',
        name: 'מספרת ברק',
        address: 'רחוב בן יהודה 12, תל אביב',
        distance: '2.1 ק"מ',
        rating: 4.5,
        reviewCount: 98,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        services: ['תספורת', 'טיפוח'],
        phone: '03-5678901',
        priceRange: '₪40-80',
        description: 'מספרה משפחתית עם מחירים נוחים',
        workingHours: {
          'ראשון': { open: '08:30', close: '17:30', closed: false },
          'שני': { open: '08:30', close: '17:30', closed: false },
          'שלישי': { open: '08:30', close: '17:30', closed: false },
          'רביעי': { open: '08:30', close: '17:30', closed: false },
          'חמישי': { open: '08:30', close: '17:30', closed: false },
          'שישי': { open: '08:30', close: '14:30', closed: false },
          'שבת': { open: '00:00', close: '00:00', closed: true }
        }
      },
      {
        id: '6',
        name: 'מספרת גיל',
        address: 'רחוב דיזנגוף 100, תל אביב',
        distance: '1.8 ק"מ',
        rating: 4.4,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
        services: ['תספורת', 'זקן'],
        phone: '03-6789012',
        priceRange: '₪55-95',
        description: 'מספרה צעירה עם אווירה דינמית',
        workingHours: {
          'ראשון': { open: '10:00', close: '20:00', closed: false },
          'שני': { open: '10:00', close: '20:00', closed: false },
          'שלישי': { open: '10:00', close: '20:00', closed: false },
          'רביעי': { open: '10:00', close: '20:00', closed: false },
          'חמישי': { open: '10:00', close: '20:00', closed: false },
          'שישי': { open: '10:00', close: '16:00', closed: false },
          'שבת': { open: '00:00', close: '00:00', closed: true }
        }
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setAllSalons(mockSalons)
      setFilteredSalons(mockSalons)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Sort salons
  const sortSalons = (salons: Salon[]) => {
    return [...salons].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'distance':
          const distanceA = parseFloat(a.distance.replace(' ק"מ', ''))
          const distanceB = parseFloat(b.distance.replace(' ק"מ', ''))
          comparison = distanceA - distanceB
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          const priceA = parseInt(a.priceRange.replace('₪', '').split('-')[0])
          const priceB = parseInt(b.priceRange.replace('₪', '').split('-')[0])
          comparison = priceA - priceB
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  // Handle search results
  const handleSearchResults = (results: Salon[]) => {
    setFilteredSalons(sortSalons(results))
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">טוען מספרות...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <Header 
        title="כל המספרות" 
        showBackButton={true}
        currentPage="salons"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <SalonSearch 
            onSalonSelect={(salon) => window.location.href = `/salon/${salon.id}`}
            showFilters={true}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-text">
              {filteredSalons.length} מספרות נמצאו
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="distance">מרחק</option>
                <option value="rating">דירוג</option>
                <option value="name">שם</option>
                <option value="price">מחיר</option>
              </select>
              
              <button
                onClick={toggleSortOrder}
                className="p-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4 text-text" />
                ) : (
                  <SortDesc className="w-4 h-4 text-text" />
                )}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-onPrimary' 
                    : 'text-muted hover:text-text'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-onPrimary' 
                    : 'text-muted hover:text-text'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Salon List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
            : 'space-y-4'
        }>
          {filteredSalons.map((salon, index) => (
            <motion.div
              key={salon.id}
              className={`bg-surface border border-border rounded-2xl shadow-sm hover:border-primary/50 transition-all duration-300 cursor-pointer group ${
                viewMode === 'list' ? 'p-4 sm:p-6' : 'p-4 sm:p-6'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => window.location.href = `/salon/${salon.id}`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <>
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
                    <div className="text-sm font-semibold text-primary">{salon.priceRange}</div>
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
                </>
              ) : (
                // List View
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={salon.image}
                      alt={salon.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className={`absolute top-1 right-1 rtl:left-1 px-1 py-0.5 rounded text-xs font-semibold ${
                      isSalonOpen(salon) 
                        ? 'bg-success text-success-text' 
                        : 'bg-error text-error-text'
                    }`}>
                      {isSalonOpen(salon) ? 'פתוח' : 'סגור'}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text truncate">{salon.name}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-muted">{salon.distance}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-primary fill-current ml-1 rtl:mr-1" />
                          <span className="text-sm font-semibold text-text">{salon.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted mb-2 flex items-center">
                      <MapPin className="w-4 h-4 ml-1 rtl:mr-1 flex-shrink-0" />
                      <span className="truncate">{salon.address}</span>
                    </p>
                    
                    <p className="text-sm text-muted mb-3 line-clamp-2">{salon.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {salon.services.slice(0, 3).map((service) => (
                          <span 
                            key={service}
                            className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                        {salon.services.length > 3 && (
                          <span className="text-xs text-muted">+{salon.services.length - 3}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{salon.priceRange}</span>
                        <button className="bg-primary text-onPrimary py-1 px-3 rounded text-sm font-medium hover:opacity-90 transition-opacity">
                          הזמן תור
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSalons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">לא נמצאו מספרות</h3>
            <p className="text-muted mb-4">נסה לשנות את מילות החיפוש או הסינון</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalonListingPage
