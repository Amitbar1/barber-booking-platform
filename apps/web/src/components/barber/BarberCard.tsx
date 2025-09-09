import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Scissors, Award, MapPin } from 'lucide-react'
import { clsx } from 'clsx'

interface BarberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  barber: {
    id: string
    name: string
    title: string
    experience: number
    rating: number
    reviewsCount: number
    specialties: string[]
    avatar?: string
    isAvailable: boolean
    nextAvailable?: string
    location?: string
  }
  onBook?: (barberId: string) => void
  onViewProfile?: (barberId: string) => void
}

const BarberCard = forwardRef<HTMLDivElement, BarberCardProps>(
  ({ 
    className,
    barber,
    onBook,
    onViewProfile,
    ...props 
  }, ref) => {
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
        {/* Availability status */}
        <div className="absolute top-4 right-4 rtl:left-4 z-10">
          <div className={clsx(
            'px-3 py-1 rounded-full text-xs font-bold shadow-lg',
            barber.isAvailable
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-gradient-to-r from-barber-steel to-barber-dark text-barber-silver'
          )}>
            {barber.isAvailable ? 'זמין' : 'תפוס'}
          </div>
        </div>

        {/* Barber avatar */}
        <div className="relative h-48 overflow-hidden">
          {barber.avatar ? (
            <img
              src={barber.avatar}
              alt={barber.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-barber-gold to-barber-bronze flex items-center justify-center">
              <Scissors className="w-16 h-16 text-barber-black" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-barber-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Name and title */}
          <div className="mb-3">
            <h3 className="text-xl font-display font-bold text-barber-gold mb-1">
              {barber.name}
            </h3>
            <p className="text-barber-silver text-sm">
              {barber.title}
            </p>
          </div>

          {/* Rating and experience */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-4 h-4 text-barber-gold fill-current" />
                <span className="text-sm text-barber-platinum font-medium">
                  {barber.rating}
                </span>
                <span className="text-xs text-barber-olive">
                  ({barber.reviewsCount})
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Award className="w-4 h-4 text-barber-bronze" />
              <span className="text-sm text-barber-silver">
                {barber.experience} שנים
              </span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {barber.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-barber-steel text-barber-silver text-xs rounded-lg"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          {barber.location && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <MapPin className="w-4 h-4 text-barber-olive" />
              <span className="text-sm text-barber-silver">
                {barber.location}
              </span>
            </div>
          )}

          {/* Next available */}
          {!barber.isAvailable && barber.nextAvailable && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Clock className="w-4 h-4 text-barber-bronze" />
              <span className="text-sm text-barber-silver">
                זמין ב: {barber.nextAvailable}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => onBook?.(barber.id)}
              disabled={!barber.isAvailable}
              className={clsx(
                'flex-1 font-display font-semibold py-3 px-4 rounded-xl transition-all duration-300',
                barber.isAvailable
                  ? 'bg-gradient-to-r from-barber-gold to-barber-bronze hover:from-barber-bronze hover:to-barber-copper text-barber-black shadow-lg hover:shadow-gold transform hover:scale-105'
                  : 'bg-barber-steel text-barber-olive cursor-not-allowed'
              )}
            >
              {barber.isAvailable ? 'הזמן עכשיו' : 'לא זמין'}
            </button>
            
            <button
              onClick={() => onViewProfile?.(barber.id)}
              className="px-4 py-3 border border-barber-silver text-barber-silver hover:border-barber-gold hover:text-barber-gold rounded-xl transition-all duration-300"
            >
              פרופיל
            </button>
          </div>
        </div>
      </motion.div>
    )
  }
)

BarberCard.displayName = 'BarberCard'

export default BarberCard
