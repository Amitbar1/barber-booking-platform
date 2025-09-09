import { forwardRef, useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  onChange?: (rating: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'accent' | 'yellow' | 'red' | 'green' | 'blue'
  disabled?: boolean
  readonly?: boolean
  showValue?: boolean
  showLabel?: boolean
  label?: string
  error?: string
  helperText?: string
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  ({ 
    className,
    value = 0,
    onChange,
    max = 5,
    size = 'md',
    color = 'accent',
    disabled = false,
    readonly = false,
    showValue = false,
    showLabel = false,
    label,
    error,
    helperText,
    ...props 
  }, ref) => {
    const [hoveredRating, setHoveredRating] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    }

    const colors = {
      primary: 'text-primary-500',
      accent: 'text-accent-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500',
      green: 'text-green-500',
      blue: 'text-blue-500'
    }

    const handleStarClick = (rating: number) => {
      if (disabled || readonly) return
      onChange?.(rating)
    }

    const handleStarHover = (rating: number) => {
      if (disabled || readonly) return
      setHoveredRating(rating)
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      if (disabled || readonly) return
      setHoveredRating(0)
      setIsHovering(false)
    }

    const getStarProps = (index: number) => {
      const rating = isHovering ? hoveredRating : value
      const isFilled = index < rating
      const isHalfFilled = index === Math.floor(rating) && rating % 1 !== 0

      return {
        className: clsx(
          sizes[size],
          isFilled ? colors[color] : 'text-primary-600',
          !disabled && !readonly && 'cursor-pointer hover:scale-110',
          disabled && 'opacity-50 cursor-not-allowed',
          readonly && 'cursor-default'
        ),
        onClick: () => handleStarClick(index + 1),
        onMouseEnter: () => handleStarHover(index + 1),
        onMouseLeave: handleMouseLeave
      }
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-primary-200 mb-2">
            {label}
          </label>
        )}
        
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {Array.from({ length: max }, (_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: disabled || readonly ? 1 : 1.1 }}
              whileTap={{ scale: disabled || readonly ? 1 : 0.95 }}
            >
              <Star
                {...getStarProps(index)}
              />
            </motion.div>
          ))}
          
          {showValue && (
            <span className="text-sm text-primary-400 mr-2 rtl:ml-2">
              {value.toFixed(1)}
            </span>
          )}
        </div>

        {showLabel && (
          <div className="mt-2 text-sm text-primary-400">
            {value === 0 && 'לא דורג'}
            {value === 1 && 'גרוע'}
            {value === 2 && 'לא טוב'}
            {value === 3 && 'בינוני'}
            {value === 4 && 'טוב'}
            {value === 5 && 'מעולה'}
          </div>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-primary-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Rating.displayName = 'Rating'

export default Rating
