import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string
    title: string
    description?: string
    date?: string
    icon?: React.ReactNode
    status?: 'completed' | 'current' | 'upcoming'
    color?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
  }[]
  orientation?: 'left' | 'right' | 'center'
  size?: 'sm' | 'md' | 'lg'
  showConnector?: boolean
  clickable?: boolean
  onItemClick?: (item: any, index: number) => void
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ 
    className,
    items,
    orientation = 'left',
    size = 'md',
    showConnector = true,
    clickable = false,
    onItemClick,
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    const colors = {
      primary: 'text-primary-500',
      accent: 'text-accent-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    }

    const getItemClasses = (item: any, index: number) => {
      const status = item.status || 'upcoming'
      
      return {
        container: clsx(
          'relative flex',
          orientation === 'right' && 'flex-row-reverse',
          orientation === 'center' && 'flex-col items-center',
          clickable && 'cursor-pointer'
        ),
        content: clsx(
          'flex-1',
          orientation === 'left' && 'mr-4 rtl:ml-4',
          orientation === 'right' && 'ml-4 rtl:mr-4',
          orientation === 'center' && 'text-center mt-2'
        ),
        circle: clsx(
          'flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-200',
          status === 'completed' && 'bg-accent-500 border-accent-500 text-primary-900',
          status === 'current' && 'border-accent-500 text-accent-500',
          status === 'upcoming' && 'border-primary-600 text-primary-400',
          size === 'sm' && 'w-8 h-8 text-xs',
          size === 'md' && 'w-10 h-10 text-sm',
          size === 'lg' && 'w-12 h-12 text-base'
        ),
        line: clsx(
          'absolute bg-primary-600 transition-colors duration-200',
          orientation === 'left' && 'left-5 rtl:right-5 top-10 bottom-0 w-0.5',
          orientation === 'right' && 'right-5 rtl:left-5 top-10 bottom-0 w-0.5',
          orientation === 'center' && 'left-1/2 top-10 bottom-0 w-0.5 transform -translate-x-1/2',
          status === 'completed' && 'bg-accent-500'
        ),
        title: clsx(
          'font-medium transition-colors duration-200',
          status === 'completed' && 'text-primary-100',
          status === 'current' && 'text-accent-500',
          status === 'upcoming' && 'text-primary-400',
          sizes[size]
        ),
        description: clsx(
          'text-sm transition-colors duration-200',
          status === 'completed' && 'text-primary-300',
          status === 'current' && 'text-primary-300',
          status === 'upcoming' && 'text-primary-500'
        ),
        date: clsx(
          'text-xs transition-colors duration-200',
          status === 'completed' && 'text-primary-400',
          status === 'current' && 'text-accent-400',
          status === 'upcoming' && 'text-primary-500'
        )
      }
    }

    const handleItemClick = (item: any, index: number) => {
      if (clickable && onItemClick) {
        onItemClick(item, index)
      }
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'w-full',
          orientation === 'center' ? 'space-y-8' : 'space-y-6',
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const classes = getItemClasses(item, index)
          const status = item.status || 'upcoming'

          return (
            <motion.div
              key={item.id}
              className={classes.container}
              onClick={() => handleItemClick(item, index)}
              whileHover={clickable ? { scale: 1.02 } : {}}
              whileTap={clickable ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Timeline circle */}
              <div className={classes.circle}>
                {item.icon || (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Timeline content */}
              <div className={classes.content}>
                <div className={classes.title}>
                  {item.title}
                </div>
                
                {item.description && (
                  <div className={classes.description}>
                    {item.description}
                  </div>
                )}
                
                {item.date && (
                  <div className={classes.date}>
                    {item.date}
                  </div>
                )}
              </div>

              {/* Connector line */}
              {showConnector && !isLast && (
                <div className={classes.line} />
              )}
            </motion.div>
          )
        })}
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'

export default Timeline
