import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className,
    icon,
    title,
    description,
    action,
    size = 'md',
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16'
    }

    const iconSizes = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20'
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'flex flex-col items-center justify-center text-center',
          sizes[size],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {icon && (
          <div className={clsx('text-primary-400 mb-4', iconSizes[size])}>
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-primary-100 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-primary-400 mb-6 max-w-md">
            {description}
          </p>
        )}
        
        {action && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action}
          </div>
        )}
      </motion.div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export default EmptyState
