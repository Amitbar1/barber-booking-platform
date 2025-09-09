import { forwardRef } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title?: string
  description?: string
  closable?: boolean
  onClose?: () => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className,
    variant = 'default',
    title,
    description,
    closable = false,
    onClose,
    children,
    ...props 
  }, ref) => {
    const icons = {
      default: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info
    }

    const variants = {
      default: 'bg-primary-800 border-primary-700 text-primary-100',
      success: 'bg-green-500/20 border-green-500/30 text-green-400',
      warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      error: 'bg-red-500/20 border-red-500/30 text-red-400',
      info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    }

    const Icon = icons[variant]

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'relative rounded-lg border p-4',
          variants[variant],
          className
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-semibold mb-1">
                {title}
              </h3>
            )}
            
            {description && (
              <p className="text-sm opacity-90">
                {description}
              </p>
            )}
            
            {children}
          </div>
          
          {closable && onClose && (
            <button
              onClick={onClose}
              className="text-current opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
