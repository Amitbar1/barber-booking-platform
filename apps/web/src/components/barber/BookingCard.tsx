import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Scissors, MapPin, Phone } from 'lucide-react'
import { clsx } from 'clsx'

interface BookingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  booking: {
    id: string
    service: string
    barber: string
    date: string
    time: string
    duration: number
    price: number
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
    location?: string
    phone?: string
    notes?: string
  }
  onEdit?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onReschedule?: (bookingId: string) => void
}

const BookingCard = forwardRef<HTMLDivElement, BookingCardProps>(
  ({ 
    className,
    booking,
    onEdit,
    onCancel,
    onReschedule,
    ...props 
  }, ref) => {
    const statusColors = {
      confirmed: 'from-green-500 to-green-600',
      pending: 'from-barber-bronze to-barber-copper',
      cancelled: 'from-barber-crimson to-barber-burgundy',
      completed: 'from-barber-silver to-barber-platinum'
    }

    const statusText = {
      confirmed: 'מאושר',
      pending: 'ממתין לאישור',
      cancelled: 'בוטל',
      completed: 'הושלם'
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'group relative bg-gradient-to-br from-barber-charcoal to-barber-dark',
          'border border-barber-steel rounded-2xl overflow-hidden',
          'shadow-xl hover:shadow-gold transition-all duration-300',
          'hover:scale-105 hover:border-barber-gold/50',
          className
        )}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Status badge */}
        <div className="absolute top-4 right-4 rtl:left-4 z-10">
          <div className={clsx(
            'px-3 py-1 rounded-full text-xs font-bold shadow-lg',
            `bg-gradient-to-r ${statusColors[booking.status]} text-white`
          )}>
            {statusText[booking.status]}
          </div>
        </div>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-barber-gold mb-1">
                {booking.service}
              </h3>
              <p className="text-barber-silver text-sm">
                עם {booking.barber}
              </p>
            </div>
            
            <div className="text-right rtl:text-left">
              <div className="text-2xl font-display font-bold text-barber-gold">
                ₪{booking.price}
              </div>
              <div className="text-sm text-barber-silver">
                {booking.duration} דקות
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Calendar className="w-5 h-5 text-barber-gold" />
              <div>
                <div className="text-sm text-barber-silver">תאריך</div>
                <div className="text-barber-platinum font-medium">{booking.date}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Clock className="w-5 h-5 text-barber-bronze" />
              <div>
                <div className="text-sm text-barber-silver">שעה</div>
                <div className="text-barber-platinum font-medium">{booking.time}</div>
              </div>
            </div>

            {booking.location && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-barber-copper" />
                <div>
                  <div className="text-sm text-barber-silver">מיקום</div>
                  <div className="text-barber-platinum font-medium">{booking.location}</div>
                </div>
              </div>
            )}

            {booking.phone && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-barber-silver" />
                <div>
                  <div className="text-sm text-barber-silver">טלפון</div>
                  <div className="text-barber-platinum font-medium">{booking.phone}</div>
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="mt-3 p-3 bg-barber-steel rounded-lg">
                <div className="text-sm text-barber-silver mb-1">הערות</div>
                <div className="text-barber-platinum text-sm">{booking.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="px-6 py-4 border-t border-barber-steel">
            <div className="flex space-x-3 rtl:space-x-reverse">
              {booking.status === 'pending' && (
                <button
                  onClick={() => onEdit?.(booking.id)}
                  className="flex-1 bg-gradient-to-r from-barber-gold to-barber-bronze hover:from-barber-bronze hover:to-barber-copper text-barber-black font-display font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold transform hover:scale-105"
                >
                  ערוך
                </button>
              )}
              
              <button
                onClick={() => onReschedule?.(booking.id)}
                className="px-4 py-3 border border-barber-silver text-barber-silver hover:border-barber-gold hover:text-barber-gold rounded-xl transition-all duration-300"
              >
                דחה
              </button>
              
              <button
                onClick={() => onCancel?.(booking.id)}
                className="px-4 py-3 border border-barber-crimson text-barber-crimson hover:bg-barber-crimson hover:text-white rounded-xl transition-all duration-300"
              >
                בטל
              </button>
            </div>
          </div>
        )}
      </motion.div>
    )
  }
)

BookingCard.displayName = 'BookingCard'

export default BookingCard
