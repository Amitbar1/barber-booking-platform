import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

const Toast = ({ id, type, title, description, duration = 4000, onClose }: ToastProps) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }

  const Icon = icons[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <motion.div
      className={clsx(
        'flex items-start space-x-3 rtl:space-x-reverse p-4 rounded-lg border backdrop-blur-sm',
        'bg-primary-800/95 border-primary-700/50 shadow-xl',
        colors[type]
      )}
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary-100">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-primary-300">{description}</p>
        )}
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="text-primary-400 hover:text-primary-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default Toast
