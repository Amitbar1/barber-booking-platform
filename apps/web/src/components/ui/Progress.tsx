import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showValue?: boolean
  animated?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className,
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showValue = false,
    animated = true,
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
      error: 'bg-red-500'
    }

    return (
      <div className={clsx('w-full', className)} {...props}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-200">
            Progress
          </span>
          {showValue && (
            <span className="text-sm text-primary-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        
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
              variants[variant]
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

Progress.displayName = 'Progress'

export default Progress
