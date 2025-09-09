import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    className,
    title,
    value,
    description,
    icon,
    trend,
    color = 'primary',
    size = 'md',
    loading = false,
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const colors = {
      primary: 'text-primary-500',
      accent: 'text-accent-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500'
    }

    const trendColors = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-primary-400'
    }

    const trendIcons = {
      up: '↗',
      down: '↘',
      neutral: '→'
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'bg-primary-800 rounded-lg border border-primary-700 p-6 transition-all duration-200',
          'hover:border-accent-500/50 hover:shadow-lg',
          sizes[size],
          className
        )}
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-primary-400">
            {title}
          </h3>
          
          {icon && (
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', colors[color])}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          {loading ? (
            <div className="h-8 bg-primary-700 rounded animate-pulse" />
          ) : (
            <div className="text-3xl font-bold text-primary-100">
              {value}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-primary-400 mb-3">
            {description}
          </p>
        )}

        {/* Trend */}
        {trend && !loading && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={clsx('text-sm font-medium', trendColors[trend.direction])}>
              {trendIcons[trend.direction]} {trend.value}%
            </span>
            <span className="text-sm text-primary-400">
              {trend.label}
            </span>
          </div>
        )}
      </motion.div>
    )
  }
)

StatCard.displayName = 'StatCard'

export default StatCard
