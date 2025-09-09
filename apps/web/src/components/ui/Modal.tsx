import { forwardRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className,
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    children,
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    }

    useEffect(() => {
      if (!isOpen) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose, closeOnEscape])

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOnOverlayClick ? onClose : undefined}
            />
            
            {/* Modal */}
            <motion.div
              ref={ref}
              className={clsx(
                'relative w-full bg-primary-800 rounded-xl border border-primary-700 shadow-2xl',
                sizes[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              {...props}
            >
              {/* Header */}
              {(title || description) && (
                <div className="flex items-center justify-between p-6 border-b border-primary-700">
                  <div>
                    {title && (
                      <h2 className="text-xl font-semibold text-primary-100">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-primary-400">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="text-primary-400 hover:text-primary-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
