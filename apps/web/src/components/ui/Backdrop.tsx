import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose?: () => void
  blur?: boolean
  opacity?: number
  zIndex?: number
}

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ 
    className,
    isOpen,
    onClose,
    blur = true,
    opacity = 0.5,
    zIndex = 40,
    ...props 
  }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            className={clsx(
              'fixed inset-0 bg-black',
              blur && 'backdrop-blur-sm',
              className
            )}
            style={{ 
              zIndex,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            {...props}
          />
        )}
      </AnimatePresence>
    )
  }
)

Backdrop.displayName = 'Backdrop'

export default Backdrop
