import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, Star, Scissors, Zap } from 'lucide-react'
import { clsx } from 'clsx'

interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  service: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    category: 'haircut' | 'beard' | 'styling' | 'grooming'
    image?: string
    rating?: number
    popular?: boolean
  }
  onBook?: (serviceId: string) => void
  onViewDetails?: (serviceId: string) => void
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ 
    className,
    service,
    onBook,
    onViewDetails,
    ...props 
  }, ref) => {
    const categoryIcons = {
      haircut: Scissors,
      beard: Zap,
      styling: Star,
      grooming: Clock
    }

    const categoryColors = {
      haircut: 'from-barber-gold to-barber-bronze',
      beard: 'from-barber-copper to-barber-brass',
      styling: 'from-barber-silver to-barber-platinum',
      grooming: 'from-barber-navy to-barber-deep'
    }

    const Icon = categoryIcons[service.category]

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
        {/* Popular badge */}
        {service.popular && (
          <div className="absolute top-4 right-4 rtl:left-4 z-10">
            <div className="bg-gradient-to-r from-barber-gold to-barber-bronze text-barber-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              פופולרי
            </div>
          </div>
        )}

        {/* Service image */}
        <div className="relative h-48 overflow-hidden">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className={clsx(
              'w-full h-full bg-gradient-to-br',
              categoryColors[service.category],
              'flex items-center justify-center'
            )}>
              <Icon className="w-16 h-16 text-barber-black" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-barber-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon className="w-4 h-4 text-barber-gold" />
              <span className="text-sm text-barber-silver capitalize">
                {service.category === 'haircut' && 'תספורת'}
                {service.category === 'beard' && 'זקן'}
                {service.category === 'styling' && 'תסרוקת'}
                {service.category === 'grooming' && 'טיפוח'}
              </span>
            </div>
            
            {service.rating && (
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-4 h-4 text-barber-gold fill-current" />
                <span className="text-sm text-barber-platinum font-medium">
                  {service.rating}
                </span>
              </div>
            )}
          </div>

          {/* Service name */}
          <h3 className="text-xl font-display font-bold text-barber-gold mb-2">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-barber-silver text-sm mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* Price and duration */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Clock className="w-4 h-4 text-barber-olive" />
                <span className="text-sm text-barber-silver">
                  {service.duration} דקות
                </span>
              </div>
            </div>
            
            <div className="text-right rtl:text-left">
              <span className="text-2xl font-display font-bold text-barber-gold">
                ₪{service.price}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => onBook?.(service.id)}
              className="flex-1 bg-gradient-to-r from-barber-gold to-barber-bronze hover:from-barber-bronze hover:to-barber-copper text-barber-black font-display font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold transform hover:scale-105"
            >
              הזמן עכשיו
            </button>
            
            <button
              onClick={() => onViewDetails?.(service.id)}
              className="px-4 py-3 border border-barber-silver text-barber-silver hover:border-barber-gold hover:text-barber-gold rounded-xl transition-all duration-300"
            >
              פרטים
            </button>
          </div>
        </div>
      </motion.div>
    )
  }
)

ServiceCard.displayName = 'ServiceCard'

export default ServiceCard
