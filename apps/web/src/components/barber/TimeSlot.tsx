import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, Check, X } from 'lucide-react'
import { clsx } from 'clsx'

interface TimeSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  time: string
  isAvailable: boolean
  isSelected?: boolean
  isBooked?: boolean
  duration?: number
  price?: number
  onSelect?: (time: string) => void
  onBook?: (time: string) => void
}

const TimeSlot = forwardRef<HTMLDivElement, TimeSlotProps>(
  ({ 
    className,
    time,
    isAvailable,
    isSelected = false,
    isBooked = false,
    duration,
    price,
    onSelect,
    onBook,
    ...props 
  }, ref) => {
    const handleClick = () => {
      if (isAvailable && !isBooked) {
        onSelect?.(time)
      }
    }

    const handleBook = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isAvailable && !isBooked) {
        onBook?.(time)
      }
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'relative group cursor-pointer rounded-xl border-2 transition-all duration-300',
          'flex items-center justify-between p-4',
          isBooked && 'cursor-not-allowed opacity-50',
          isSelected && 'border-barber-gold bg-barber-gold/10 shadow-gold',
          isAvailable && !isBooked && !isSelected && 'border-barber-steel hover:border-barber-gold hover:bg-barber-steel/20',
          !isAvailable && 'border-barber-dark bg-barber-charcoal',
          className
        )}
        onClick={handleClick}
        whileHover={isAvailable && !isBooked ? { scale: 1.02 } : {}}
        whileTap={isAvailable && !isBooked ? { scale: 0.98 } : {}}
        {...props}
      >
        {/* Time and status */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            isSelected && 'bg-barber-gold text-barber-black',
            isAvailable && !isSelected && !isBooked && 'bg-barber-steel text-barber-platinum',
            !isAvailable && 'bg-barber-dark text-barber-olive'
          )}>
            <Clock className="w-5 h-5" />
          </div>
          
          <div>
            <div className={clsx(
              'text-lg font-display font-semibold',
              isSelected && 'text-barber-gold',
              isAvailable && !isSelected && !isBooked && 'text-barber-platinum',
              !isAvailable && 'text-barber-olive'
            )}>
              {time}
            </div>
            
            {duration && (
              <div className="text-sm text-barber-silver">
                {duration} דקות
              </div>
            )}
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {price && (
            <div className="text-right rtl:text-left">
              <div className="text-lg font-display font-bold text-barber-gold">
                ₪{price}
              </div>
            </div>
          )}

          {/* Status icon */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            {isBooked ? (
              <X className="w-5 h-5 text-barber-crimson" />
            ) : isSelected ? (
              <Check className="w-5 h-5 text-barber-gold" />
            ) : isAvailable ? (
              <div className="w-3 h-3 rounded-full bg-barber-gold" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-barber-olive" />
            )}
          </div>
        </div>

        {/* Book button */}
        {isAvailable && !isBooked && (
          <motion.button
            onClick={handleBook}
            className={clsx(
              'absolute inset-0 bg-gradient-to-r from-barber-gold to-barber-bronze',
              'text-barber-black font-display font-semibold rounded-xl',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              'flex items-center justify-center space-x-2 rtl:space-x-reverse'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>הזמן עכשיו</span>
          </motion.button>
        )}

        {/* Booked overlay */}
        {isBooked && (
          <div className="absolute inset-0 bg-barber-crimson/20 rounded-xl flex items-center justify-center">
            <span className="text-barber-crimson font-display font-semibold">
              תפוס
            </span>
          </div>
        )}
      </motion.div>
    )
  }
)

TimeSlot.displayName = 'TimeSlot'

export default TimeSlot
