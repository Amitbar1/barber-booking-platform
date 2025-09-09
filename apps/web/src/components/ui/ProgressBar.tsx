import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  showValue?: boolean
  showPercentage?: boolean
  animated?: boolean
  striped?: boolean
  label?: string
  description?: string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className,
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showValue = false,
    showPercentage = false,
    animated = true,
    striped = false,
    label,
    description,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    }
    
    const variants = {
      default: 'bg-accent-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    }

    const stripedClasses = striped ? 'bg-stripes' : ''

    return (
      <div className={clsx('w-full', className)} {...props}>
        {/* Label and value */}
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm font-medium text-primary-200">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm text-primary-400">
                {showPercentage ? `${Math.round(percentage)}%` : `${value}/${max}`}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-primary-400 mb-2">
            {description}
          </p>
        )}

        {/* Progress bar */}
        <div
          ref={ref}
          className={clsx(
            'w-full bg-primary-700 rounded-full overflow-hidden',
            sizes[size]
          )}
        >
          <motion.div
            className={clsx(
              'h-full rounded-full transition-all duration-300',
              variants[variant],
              stripedClasses
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: animated ? 0.8 : 0,
              ease: 'easeOut'
            }}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
