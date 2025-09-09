import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Users, 
  Scissors, 
  DollarSign, 
  Clock,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronDown
} from 'lucide-react'
import ScissorsIcon from '../components/ui/ScissorsIcon'
import Header from '../components/Header'
import BrandingSettings from '../components/BrandingSettings'

interface Booking {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  price: number
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
  active: boolean
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalBookings: number
  lastVisit: string
  totalSpent: number
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // טוען את הטאב הפעיל מ-localStorage או ברירת מחדל
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveTab') || 'overview'
    }
    return 'overview'
  })

  const [isBarberMode, setIsBarberMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isBarberMode') === 'true'
    }
    return false
  })

  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'month'>('week')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // שמירת הטאב הפעיל ב-localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminActiveTab', activeTab)
    }
  }, [activeTab])

  // שמירת מצב הטוגל ב-localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isBarberMode', isBarberMode.toString())
    }
  }, [isBarberMode])

  // סגירת dropdown כשלוחצים מחוץ לו
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  // עדכון זמן אמיתי
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // וידוא שהדף תמיד נטען מלמעלה
  useEffect(() => {
    // גלילה מיידית למעלה העמוד ללא אנימציה
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])


  // פונקציה ליצירת תאריך של היום
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'דוד כהן',
      service: 'תספורת גברים',
      date: getTodayDate(),
      time: '10:00',
      status: 'confirmed',
      price: 80
    },
    {
      id: '2',
      customerName: 'מיכאל לוי',
      service: 'טיפוח זקן',
      date: getTodayDate(),
      time: '11:30',
      status: 'pending',
      price: 60
    },
    {
      id: '3',
      customerName: 'יוסי ישראלי',
      service: 'תספורת + זקן',
      date: getTodayDate(),
      time: '14:00',
      status: 'confirmed',
      price: 120
    },
    {
      id: '4',
      customerName: 'רמי ישראלי',
      service: 'תספורת גברים',
      date: getTodayDate(),
      time: '09:00',
      status: 'confirmed',
      price: 80
    },
    {
      id: '5',
      customerName: 'שלמה כהן',
      service: 'טיפוח זקן',
      date: getTodayDate(),
      time: '15:00',
      status: 'pending',
      price: 60
    }
  ])

  const [services] = useState<Service[]>([
    { id: '1', name: 'תספורת גברים', price: 80, duration: 45, category: 'תספורת', active: true },
    { id: '2', name: 'טיפוח זקן', price: 60, duration: 30, category: 'זקן', active: true },
    { id: '3', name: 'תספורת + זקן', price: 120, duration: 75, category: 'חבילה', active: true },
    { id: '4', name: 'שטיפת שיער', price: 30, duration: 15, category: 'טיפוח', active: false }
  ])

  const [customers] = useState<Customer[]>([
    { id: '1', name: 'דוד כהן', phone: '050-1234567', email: 'david@email.com', totalBookings: 12, lastVisit: '2024-01-10', totalSpent: 960 },
    { id: '2', name: 'מיכאל לוי', phone: '050-2345678', email: 'michael@email.com', totalBookings: 8, lastVisit: '2024-01-12', totalSpent: 640 },
    { id: '3', name: 'יוסי ישראלי', phone: '050-3456789', email: 'yossi@email.com', totalBookings: 15, lastVisit: '2024-01-14', totalSpent: 1200 }
  ])

  const stats = {
    totalBookings: 156,
    todayBookings: 8,
    totalRevenue: 12480,
    activeCustomers: 89,
    averageRating: 4.8,
    totalReviews: 127
  }

  const tabs = [
    { id: 'overview', label: 'סקירה כללית', icon: BarChart3 },
    { id: 'bookings', label: 'תורים', icon: Calendar },
    { id: 'calendar', label: 'יומן', icon: Calendar },
    { id: 'customers', label: 'לקוחות', icon: Users },
    { id: 'services', label: 'שירותים', icon: Scissors },
    { id: 'branding', label: 'עיצוב', icon: Settings },
    { id: 'settings', label: 'הגדרות', icon: Settings }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success/20 text-success'
      case 'pending': return 'bg-warning/20 text-warning'
      case 'cancelled': return 'bg-error/20 text-error'
      default: return 'bg-muted/20 text-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'מאושר'
      case 'pending': return 'ממתין'
      case 'cancelled': return 'בוטל'
      default: return 'לא ידוע'
    }
  }

  return (
    <div className="min-h-screen bg-bg" style={{ scrollBehavior: 'auto' }}>
      {/* Header */}
      <Header 
        title="ממשק ניהול" 
        currentPage="admin"
        className="shadow-lg"
      />

      {/* Barber Mode Toggle - Sticky */}
      <div className="bg-surface/95 backdrop-blur-md border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-center">
            <div className="bg-surface-elevated rounded-xl p-1 shadow-sm border border-border flex relative w-full max-w-md">
              {/* כפתור מצב ניהול */}
              <button
                onClick={() => {
                  setIsBarberMode(false)
                  window.scrollTo(0, 0)
                  document.documentElement.scrollTop = 0
                  document.body.scrollTop = 0
                }}
                className={`relative flex items-center justify-center space-x-1 sm:space-x-2 rtl:space-x-reverse px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 flex-1 ${
                  !isBarberMode 
                    ? 'bg-primary text-onPrimary shadow-sm' 
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                {/* Circle indicator for selected state */}
                {!isBarberMode && (
                  <div className="absolute -inset-1 rounded-lg border-2 border-primary/30 animate-pulse"></div>
                )}
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="text-xs sm:text-sm font-medium relative z-10 hidden sm:inline">מצב ניהול</span>
                <span className="text-xs font-medium relative z-10 sm:hidden">ניהול</span>
              </button>
              
              {/* כפתור מצב מספרה */}
              <button
                onClick={() => {
                  setIsBarberMode(true)
                  window.scrollTo(0, 0)
                  document.documentElement.scrollTop = 0
                  document.body.scrollTop = 0
                }}
                className={`relative flex items-center justify-center space-x-1 sm:space-x-2 rtl:space-x-reverse px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 flex-1 ${
                  isBarberMode 
                    ? 'bg-primary text-onPrimary shadow-sm' 
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                {/* Circle indicator for selected state */}
                {isBarberMode && (
                  <div className="absolute -inset-1 rounded-lg border-2 border-primary/30 animate-pulse"></div>
                )}
                <ScissorsIcon className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                <span className="text-xs sm:text-sm font-medium relative z-10 hidden sm:inline">אני במספרה</span>
                <span className="text-xs font-medium relative z-10 sm:hidden">מספרה</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barber Mode Dashboard */}
      {isBarberMode ? (
        <div className="min-h-screen bg-bg">
          {/* שעון במצב מספרה */}
          <div 
            data-clock-section
            className="py-4 sm:py-6 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 50%, var(--primary-light) 100%)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
            }}
          >
            {/* אפקט רקע מודרני */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div 
                className="text-3xl sm:text-5xl md:text-7xl font-bold mb-1 sm:mb-2 tracking-tight"
                style={{ 
                  color: 'var(--primary-text)',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  animation: 'fadeIn 0.8s ease-out'
                }}
              >
                {currentTime.toLocaleTimeString('he-IL', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div 
                className="text-sm sm:text-xl md:text-2xl font-medium opacity-95 px-4"
                style={{ 
                  color: 'var(--primary-text)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  animation: 'fadeIn 0.8s ease-out 0.2s both'
                }}
              >
                {currentTime.toLocaleDateString('he-IL', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mini Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text mb-4">היום שלי</h2>
                  
                  {/* תצוגה יומית במצב מספרה */}
                  <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                    {/* Header יומי - דביק */}
                    <div className="grid grid-cols-12 border-b border-border sticky top-0 bg-surface z-20 shadow-sm">
                      <div className="col-span-2 p-4 border-r border-border bg-muted/50">
                        <span className="text-sm font-medium text-muted">שעה</span>
                      </div>
                      <div className="col-span-10 p-4 bg-muted/50">
                        <span className="text-sm font-medium text-muted">
                          {currentTime.toLocaleDateString('he-IL', { 
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Container עם גלילה */}
                    <div 
                      className="max-h-96 overflow-y-auto"
                    >

                    {/* שעות היום */}
                    <div className="grid grid-cols-12">
                      {/* עמודת שעות */}
                      <div className="col-span-2 border-r border-border">
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = i + 8; // 8:00 - 19:00
                          const isCurrentHour = currentTime.getHours() === hour
                          return (
                            <div 
                              key={hour} 
                              data-hour={hour}
                              className={`h-16 border-b border-border flex items-start justify-center pt-1 relative ${
                                isCurrentHour ? 'bg-warning/20' : ''
                              }`}
                            >
                              <span className={`text-xs ${isCurrentHour ? 'text-warning font-bold' : 'text-muted'}`}>
                                {hour}:00
                              </span>
                              {/* אינדיקציה לשעה הנוכחית */}
                              {isCurrentHour && (
                                <div className="absolute right-0 top-0 w-1 h-full bg-error"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* תורים של היום */}
                      <div className="col-span-10">
                        {Array.from({ length: 12 }, (_, hourIndex) => {
                          const hour = hourIndex + 8;
                          const isCurrentHour = currentTime.getHours() === hour
                          const dayBookings = bookings.filter(booking => {
                            const bookingHour = parseInt(booking.time.split(':')[0]);
                            return bookingHour === hour;
                          });

                          return (
                            <div 
                              key={hourIndex} 
                              data-hour={hour}
                              className={`h-16 border-b border-border relative group hover:bg-muted/50 ${
                                isCurrentHour ? 'bg-warning/10' : ''
                              }`}
                            >
                              {/* קו אינדיקציה לשעה הנוכחית */}
                              {isCurrentHour && (
                                <div className="absolute left-0 top-0 w-full h-0.5 bg-error z-20"></div>
                              )}
                              
                              {dayBookings.map((booking, bookingIndex) => (
                                <div
                                  key={booking.id}
                                  className={`absolute inset-1 rounded-md p-2 text-sm cursor-pointer transition-all hover:shadow-md ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-success/20 border-l-4 border-success text-success' 
                                      : booking.status === 'pending'
                                      ? 'bg-warning/20 border-l-4 border-warning text-warning'
                                      : 'bg-error/20 border-l-4 border-error text-error'
                                  }`}
                                  style={{ zIndex: 10 + bookingIndex }}
                                >
                                  <div className="font-medium truncate">
                                    {booking.customerName}
                                  </div>
                                  <div className="text-xs opacity-80 truncate">
                                    {booking.service} - ₪{booking.price}
                                  </div>
                                </div>
                              ))}
                              
                              {/* כפתור הוספת תור */}
                              <button 
                                className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                onClick={() => {
                                  console.log(`הוספת תור בשעה ${hour}:00`);
                                }}
                              >
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <Plus className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications & Quick Actions */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">התראות</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-warning/10 rounded-lg">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-text">תור מתקרב</p>
                        <p className="text-xs text-muted">דוד כהן - 14:30</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-success/10 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-text">תור חדש</p>
                        <p className="text-xs text-muted">מיכאל לוי - 16:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">היום</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">תורים היום</span>
                      <span className="text-lg font-semibold text-text">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">הושלמו</span>
                      <span className="text-lg font-semibold text-success">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">נותרו</span>
                      <span className="text-lg font-semibold text-warning">3</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">פעולות מהירות</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-primary text-onPrimary py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      תור חדש
                    </button>
                    <button className="w-full border border-border text-text py-2 px-4 rounded-lg text-sm font-medium hover:bg-surface transition-colors">
                      ביטול תור
                    </button>
                    <button className="w-full border border-border text-text py-2 px-4 rounded-lg text-sm font-medium hover:bg-surface transition-colors">
                      עדכון סטטוס
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <aside className="hidden lg:block w-64 bg-surface border-r border-border min-h-screen shadow-xl">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary to-primary-hover text-primary-text shadow-lg font-medium'
                          : 'text-text-muted hover:bg-surface-hover hover:text-text hover:font-medium'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden bg-surface border-b border-border sticky top-24 z-30">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 rtl:space-x-reverse px-4 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-onPrimary shadow-sm font-medium'
                        : 'text-text-muted hover:bg-surface-hover hover:text-text'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text">סקירה כללית</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted text-xs sm:text-sm">סה"כ תורים</p>
                      <p className="text-xl sm:text-3xl font-bold text-text">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                
                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted text-xs sm:text-sm">תורים היום</p>
                      <p className="text-xl sm:text-3xl font-bold text-text">{stats.todayBookings}</p>
                    </div>
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                
                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted text-xs sm:text-sm">הכנסות</p>
                      <p className="text-lg sm:text-3xl font-bold text-text">₪{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                
                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted text-xs sm:text-sm">לקוחות פעילים</p>
                      <p className="text-xl sm:text-3xl font-bold text-text">{stats.activeCustomers}</p>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-text">תורים אחרונים</h3>
                  <button className="text-primary hover:text-primary/80 transition-colors p-2">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-surface/50 border border-border rounded-lg gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse min-w-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-text text-sm sm:text-base truncate">{booking.customerName}</p>
                          <p className="text-xs sm:text-sm text-muted truncate">{booking.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 rtl:space-x-reverse">
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-text">{booking.date}</p>
                          <p className="text-xs sm:text-sm text-muted">{booking.time}</p>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        <span className="font-semibold text-text text-sm sm:text-base">₪{booking.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text">ניהול תורים</h2>
                <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
                  <button 
                    className="border-2 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                    style={{
                      borderColor: 'var(--primary)',
                      backgroundColor: 'transparent',
                      color: 'var(--primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    <Filter className="w-4 h-4 ml-1 sm:ml-2 rtl:mr-1 sm:rtl:mr-2" />
                    <span className="hidden sm:inline">סינון</span>
                  </button>
                  <button 
                    className="rounded-xl px-3 sm:px-4 py-2 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-text)'
                    }}
                  >
                    <Plus className="w-4 h-4 ml-1 sm:ml-2 rtl:mr-1 sm:rtl:mr-2" />
                    <span className="hidden sm:inline">תור חדש</span>
                    <span className="sm:hidden">חדש</span>
                  </button>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-4 px-6 text-text">לקוח</th>
                        <th className="text-right py-4 px-6 text-text">שירות</th>
                        <th className="text-right py-4 px-6 text-text">תאריך</th>
                        <th className="text-right py-4 px-6 text-text">שעה</th>
                        <th className="text-right py-4 px-6 text-text">סטטוס</th>
                        <th className="text-right py-4 px-6 text-text">מחיר</th>
                        <th className="text-right py-4 px-6 text-text">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border/50">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-text">{booking.customerName}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-text">{booking.service}</td>
                          <td className="py-4 px-6 text-text">{booking.date}</td>
                          <td className="py-4 px-6 text-text">{booking.time}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-text">₪{booking.price}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <button className="text-muted hover:text-primary transition-colors p-1">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-muted hover:text-error transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-surface/50 border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-text text-sm sm:text-base">{booking.customerName}</p>
                          <p className="text-xs sm:text-sm text-muted">{booking.service}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs sm:text-sm text-muted">
                          <p>{booking.date}</p>
                          <p>{booking.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text text-sm sm:text-base">₪{booking.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <button className="text-muted hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-muted hover:text-error transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text">ניהול לקוחות</h2>
                <button 
                  className="rounded-xl px-3 sm:px-4 py-2 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-text)'
                  }}
                >
                  <Plus className="w-4 h-4 ml-1 sm:ml-2 rtl:mr-1 sm:rtl:mr-2" />
                  <span className="hidden sm:inline">לקוח חדש</span>
                  <span className="sm:hidden">חדש</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-text)'
                        }}
                      >
                        <span className="font-semibold text-base sm:text-lg">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                        <button className="text-muted hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-muted hover:text-error transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-text">{customer.name}</h3>
                    <p className="text-muted text-xs sm:text-sm mb-1">{customer.phone}</p>
                    <p className="text-muted text-xs sm:text-sm mb-3 sm:mb-4">{customer.email}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted">תורים:</span>
                        <span className="text-text">{customer.totalBookings}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted">הוצאה כוללת:</span>
                        <span className="font-semibold text-text">₪{customer.totalSpent}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted">ביקור אחרון:</span>
                        <span className="text-text">{customer.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text">ניהול שירותים</h2>
                <button 
                  className="rounded-xl px-3 sm:px-4 py-2 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-text)'
                  }}
                >
                  <Plus className="w-4 h-4 ml-1 sm:ml-2 rtl:mr-1 sm:rtl:mr-2" />
                  <span className="hidden sm:inline">שירות חדש</span>
                  <span className="sm:hidden">חדש</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-text pr-2">{service.name}</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                        <button className="text-muted hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-muted hover:text-error transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted text-xs sm:text-sm">קטגוריה:</span>
                        <span 
                          className="px-2 py-1 rounded text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-text)'
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted">מחיר:</span>
                        <span className="font-semibold text-text">₪{service.price}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted">משך זמן:</span>
                        <span className="text-text">{service.duration} דקות</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted text-xs sm:text-sm">סטטוס:</span>
                        <span className={`px-2 py-1 rounded text-xs sm:text-sm ${
                          service.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                        }`}>
                          {service.active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text">יומן התורים</h2>
                
                {/* Dropdown כמו Google Calendar */}
                <div className="relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDropdownOpen(!isDropdownOpen)
                    }}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 sm:px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px] w-full sm:w-auto"
                  >
                    <span className="text-xs sm:text-sm">
                      {calendarView === 'week' ? 'שבועי' : 
                       calendarView === 'day' ? 'יומי' : 'חודשי'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 rtl:left-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCalendarView('day')
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${
                          calendarView === 'day' ? 'bg-primary/10 text-primary' : 'text-text'
                        }`}
                      >
                        יומי
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCalendarView('week')
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${
                          calendarView === 'week' ? 'bg-primary/10 text-primary' : 'text-text'
                        }`}
                      >
                        שבועי
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCalendarView('month')
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${
                          calendarView === 'month' ? 'bg-primary/10 text-primary' : 'text-text'
                        }`}
                      >
                        חודשי
                      </button>
                    </div>
                  )}
                </div>
              </div>

               {/* תצוגת יומן לפי בחירה */}
               {calendarView === 'week' && (
                 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                   {/* Header עם ימים */}
                   <div className="grid grid-cols-8 border-b border-border">
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">שעה</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">א</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">ראשון</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ב</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">שני</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ג</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">שלישי</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ד</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">רביעי</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ה</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">חמישי</span>
                     </div>
                     <div className="p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ו</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">שישי</span>
                     </div>
                     <div className="p-2 sm:p-4 bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">ש</span>
                       <span className="hidden sm:inline text-xs sm:text-sm font-medium text-muted">שבת</span>
                     </div>
                   </div>

                  {/* שעות היום */}
                  <div className="grid grid-cols-8">
                    {/* עמודת שעות */}
                    <div className="border-r border-border">
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 8; // 8:00 - 19:00
                        return (
                          <div key={hour} className="h-12 sm:h-16 border-b border-border flex items-start justify-end pr-1 sm:pr-2 pt-1">
                            <span className="text-xs text-muted">{hour}:00</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* ימים */}
                    {Array.from({ length: 7 }, (_, dayIndex) => (
                      <div key={dayIndex} className="border-r border-border last:border-r-0">
                        {Array.from({ length: 12 }, (_, hourIndex) => {
                          const hour = hourIndex + 8;
                          const dayBookings = bookings.filter(booking => {
                            const bookingHour = parseInt(booking.time.split(':')[0]);
                            return bookingHour === hour && dayIndex === 0; // רק יום ראשון לדוגמה
                          });

                          return (
                            <div key={hourIndex} className="h-12 sm:h-16 border-b border-border relative group hover:bg-muted/50">
                              {dayBookings.map((booking, bookingIndex) => (
                                <div
                                  key={booking.id}
                                  className={`absolute inset-0.5 sm:inset-1 rounded-md p-0.5 sm:p-1 text-xs cursor-pointer transition-all hover:shadow-md ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-success/20 border-l-2 sm:border-l-4 border-success text-success' 
                                      : booking.status === 'pending'
                                      ? 'bg-warning/20 border-l-2 sm:border-l-4 border-warning text-warning'
                                      : 'bg-error/20 border-l-2 sm:border-l-4 border-error text-error'
                                  }`}
                                  style={{ zIndex: 10 + bookingIndex }}
                                >
                                  <div className="font-medium truncate text-xs">
                                    {booking.customerName}
                                  </div>
                                  <div className="opacity-80 truncate text-xs hidden sm:block">
                                    {booking.service}
                                  </div>
                                  <div className="opacity-60 text-xs hidden sm:block">
                                    ₪{booking.price}
                                  </div>
                                </div>
                              ))}
                              
                              {/* כפתור הוספת תור */}
                              <button 
                                className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center min-h-[44px]"
                                onClick={() => {
                                  console.log(`הוספת תור ביום ${dayIndex + 1} בשעה ${hour}:00`);
                                }}
                              >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

               {/* תצוגה יומית */}
               {calendarView === 'day' && (
                 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                   {/* Header יומי */}
                   <div className="grid grid-cols-12 border-b border-border">
                     <div className="col-span-3 sm:col-span-2 p-2 sm:p-4 border-r border-border bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">שעה</span>
                     </div>
                     <div className="col-span-9 sm:col-span-10 p-2 sm:p-4 bg-muted/50">
                       <span className="text-xs sm:text-sm font-medium text-muted">היום - 15 בינואר 2024</span>
                     </div>
                   </div>

                  {/* שעות היום */}
                  <div className="grid grid-cols-12">
                    {/* עמודת שעות - צרה יותר */}
                    <div className="col-span-3 sm:col-span-2 border-r border-border">
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 8; // 8:00 - 19:00
                        return (
                          <div key={hour} className="h-12 sm:h-16 border-b border-border flex items-start justify-center pt-1">
                            <span className="text-xs text-muted">{hour}:00</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* תורים של היום - רחב יותר */}
                    <div className="col-span-9 sm:col-span-10">
                      {Array.from({ length: 12 }, (_, hourIndex) => {
                        const hour = hourIndex + 8;
                        const dayBookings = bookings.filter(booking => {
                          const bookingHour = parseInt(booking.time.split(':')[0]);
                          return bookingHour === hour;
                        });

                        return (
                          <div key={hourIndex} className="h-12 sm:h-16 border-b border-border relative group hover:bg-muted/50">
                            {dayBookings.map((booking, bookingIndex) => (
                              <div
                                key={booking.id}
                                className={`absolute inset-0.5 sm:inset-1 rounded-md p-1 sm:p-2 text-xs sm:text-sm cursor-pointer transition-all hover:shadow-md ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-success/20 border-l-2 sm:border-l-4 border-success text-success' 
                                    : booking.status === 'pending'
                                    ? 'bg-warning/20 border-l-2 sm:border-l-4 border-warning text-warning'
                                    : 'bg-error/20 border-l-2 sm:border-l-4 border-error text-error'
                                }`}
                                style={{ zIndex: 10 + bookingIndex }}
                              >
                                <div className="font-medium truncate text-xs">
                                  {booking.customerName}
                                </div>
                                <div className="text-xs opacity-80 truncate hidden sm:block">
                                  {booking.service} - ₪{booking.price}
                                </div>
                              </div>
                            ))}
                            
                            {/* כפתור הוספת תור */}
                            <button 
                              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center min-h-[44px]"
                              onClick={() => {
                                console.log(`הוספת תור בשעה ${hour}:00`);
                              }}
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                                <Plus className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

               {/* תצוגה חודשית */}
               {calendarView === 'month' && (
                 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                   {/* Header חודשי */}
                   <div className="grid grid-cols-7 border-b border-border">
                     {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                       <div key={day} className="p-2 sm:p-4 border-r border-border last:border-r-0 bg-muted/50">
                         <span className="text-xs sm:text-sm font-medium text-muted">{day}</span>
                       </div>
                     ))}
                   </div>

                  {/* ימי החודש */}
                  <div className="grid grid-cols-7">
                    {Array.from({ length: 35 }, (_, dayIndex) => {
                      const day = dayIndex + 1;
                      const dayBookings = bookings.filter(booking => {
                        const bookingDay = parseInt(booking.date.split('-')[2]);
                        return bookingDay === day;
                      });

                      return (
                        <div key={day} className="h-16 sm:h-24 border-r border-b border-border last:border-r-0 relative group hover:bg-muted/50">
                          <div className="p-1 sm:p-2">
                            <span className="text-xs sm:text-sm font-medium text-text">{day}</span>
                            {dayBookings.length > 0 && (
                              <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                                {dayBookings.slice(0, 2).map((booking) => (
                                  <div
                                    key={booking.id}
                                    className={`text-xs p-0.5 sm:p-1 rounded cursor-pointer truncate ${
                                      booking.status === 'confirmed' 
                                        ? 'bg-success/20 text-success' 
                                        : booking.status === 'pending'
                                        ? 'bg-warning/20 text-warning'
                                        : 'bg-error/20 text-error'
                                    }`}
                                  >
                                    <span className="hidden sm:inline">{booking.time} - {booking.customerName}</span>
                                    <span className="sm:hidden">{booking.customerName}</span>
                                  </div>
                                ))}
                                {dayBookings.length > 2 && (
                                  <div className="text-xs text-muted">
                                    +{dayBookings.length - 2} נוספים
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* כפתור הוספת תור */}
                          <button 
                            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center min-h-[44px]"
                            onClick={() => {
                              console.log(`הוספת תור ביום ${day}`);
                            }}
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* הוספת תור חדש */}
              <div className="mt-4 sm:mt-6">
                <button className="w-full bg-primary text-onPrimary py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 rtl:space-x-reverse min-h-[44px]">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">הוסף תור חדש</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BrandingSettings />
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text">הגדרות</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-text">פרטי המספרה</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        שם המספרה
                      </label>
                      <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]" defaultValue="מספרת דוד" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        כתובת
                      </label>
                      <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]" defaultValue="רחוב הרצל 15, תל אביב" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        טלפון
                      </label>
                      <input type="tel" className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]" defaultValue="03-1234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        אימייל
                      </label>
                      <input type="email" className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]" defaultValue="info@david-barber.co.il" />
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-text">שעות פעילות</h3>
                  <div className="space-y-3">
                    {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <span className="w-16 sm:w-20 text-text text-sm sm:text-base">{day}</span>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="time" className="w-24 sm:w-32 px-2 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] text-sm" defaultValue="09:00" />
                          <span className="text-text text-sm">עד</span>
                          <input type="time" className="w-24 sm:w-32 px-2 sm:px-4 py-2 sm:py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] text-sm" defaultValue="18:00" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-text">הגדרות התראות</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="flex items-center space-x-3 rtl:space-x-reverse min-h-[44px]">
                      <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                      <span className="text-text text-sm sm:text-base">התראות SMS</span>
                    </label>
                    <label className="flex items-center space-x-3 rtl:space-x-reverse min-h-[44px]">
                      <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                      <span className="text-text text-sm sm:text-base">התראות אימייל</span>
                    </label>
                    <label className="flex items-center space-x-3 rtl:space-x-reverse min-h-[44px]">
                      <input type="checkbox" className="w-4 h-4 text-primary" />
                      <span className="text-text text-sm sm:text-base">התראות WhatsApp</span>
                    </label>
                  </div>
                </div>

                <button 
                  className="w-full sm:w-auto rounded-xl px-4 sm:px-6 py-3 hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-text)'
                  }}
                >
                  <span className="text-sm sm:text-base">שמור הגדרות</span>
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
      )}
    </div>
  )
}

export default AdminDashboard
