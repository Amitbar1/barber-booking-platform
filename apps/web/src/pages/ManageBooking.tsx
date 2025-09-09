import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Trash2, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Header from '../components/Header'

interface BookingDetails {
  id: string
  date: string
  time: string
  status: string
  totalPrice: number
  salon: {
    name: string
    address: string
    phone: string
  }
  service: {
    name: string
    duration: number
  }
  customer: {
    name: string
    phone: string
  }
}

const ManageBooking = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Load booking details
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/manage/${token}`)
        const data = await response.json()

        if (data.success) {
          setBooking(data.booking)
        } else {
          setError(data.message || 'הזמנה לא נמצאה')
        }
      } catch (error) {
        console.error('Load booking error:', error)
        setError('שגיאה בטעינת פרטי ההזמנה')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadBooking()
    } else {
      setError('קישור לא תקין')
      setLoading(false)
    }
  }, [token])

  // Cancel booking
  const handleCancelBooking = async () => {
    if (!token) return

    setIsCancelling(true)
    try {
      const response = await fetch(`/api/manage/${token}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        setBooking(prev => prev ? { ...prev, status: 'CANCELLED' } : null)
        setShowCancelConfirm(false)
      } else {
        setError(data.message || 'שגיאה בביטול ההזמנה')
      }
    } catch (error) {
      console.error('Cancel booking error:', error)
      setError('שגיאה בחיבור לשרת')
    } finally {
      setIsCancelling(false)
    }
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

  // Format time for display
  const formatTime = (timeString: string) => {
    return timeString
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="mr-3 text-onSurface">טוען פרטי ההזמנה...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <h2 className="text-2xl font-bold text-onSurface mb-2">
                שגיאה
              </h2>
              <p className="text-onSurface/70 mb-6">
                {error || 'הזמנה לא נמצאה או הקישור לא תקין'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-onPrimary rounded-xl px-6 py-3 font-semibold hover:opacity-90 focus:ring-2 focus:ring-primary/50"
              >
                חזור לעמוד הבית
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-onSurface mb-2">
                ניהול התור
              </h1>
              <p className="text-onSurface/70">
                כאן תוכל לנהל ולבטל את התור שלך
              </p>
            </div>

            {/* Booking Card */}
            <div className="bg-surface rounded-2xl p-6 shadow-lg">
              {/* Status Badge */}
              <div className="flex justify-center mb-6">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  booking.status === 'CONFIRMED' 
                    ? 'bg-success/10 text-success border border-success/20'
                    : booking.status === 'CANCELLED'
                    ? 'bg-error/10 text-error border border-error/20'
                    : 'bg-warning/10 text-warning border border-warning/20'
                }`}>
                  {booking.status === 'CONFIRMED' && 'מאושר'}
                  {booking.status === 'CANCELLED' && 'מבוטל'}
                  {booking.status === 'PENDING' && 'ממתין לאישור'}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-onSurface">
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-sm text-onSurface/70">
                      בשעה {formatTime(booking.time)}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-xl">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-onSurface">
                      {booking.service.name}
                    </p>
                    <p className="text-sm text-onSurface/70">
                      משך השירות: {booking.service.duration} דקות
                    </p>
                  </div>
                </div>

                {/* Salon */}
                <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-onSurface">
                      {booking.salon.name}
                    </p>
                    <p className="text-sm text-onSurface/70">
                      {booking.salon.address}
                    </p>
                    <p className="text-sm text-onSurface/70">
                      טלפון: {booking.salon.phone}
                    </p>
                  </div>
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-xl">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-onSurface">
                      {booking.customer.name}
                    </p>
                    <p className="text-sm text-onSurface/70">
                      {booking.customer.phone}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <span className="font-semibold text-onSurface">מחיר השירות:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₪{booking.totalPrice}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {booking.status === 'CONFIRMED' && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full bg-error text-onError rounded-xl py-3 px-4 font-semibold hover:opacity-90 focus:ring-2 focus:ring-error/50 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    בטל תור
                  </button>
                </div>
              )}

              {booking.status === 'CANCELLED' && (
                <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl text-center">
                  <p className="text-error font-semibold mb-2">
                    התור בוטל בהצלחה
                  </p>
                  <p className="text-sm text-error/80">
                    נשלח לך הודעת אישור ביטול ב-SMS
                  </p>
                </div>
              )}
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
              >
                <ArrowRight className="w-4 h-4" />
                חזור לעמוד הבית
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-bold text-onSurface mb-2">
                בטל תור
              </h3>
              <p className="text-onSurface/70">
                האם אתה בטוח שברצונך לבטל את התור?
                <br />
                פעולה זו לא ניתנת לביטול.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-surface border border-outline text-onSurface rounded-xl py-3 px-4 font-semibold hover:bg-surface/80"
              >
                ביטול
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 bg-error text-onError rounded-xl py-3 px-4 font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-onError border-t-transparent rounded-full animate-spin" />
                    מבטל...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    בטל תור
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ManageBooking

