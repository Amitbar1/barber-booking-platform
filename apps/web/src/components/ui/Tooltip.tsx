import { forwardRef, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ 
    className,
    content,
    children,
    placement = 'top',
    delay = 300,
    disabled = false,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const showTooltip = () => {
      if (disabled) return
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delay)
    }

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - contentRect.height - 8
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.left - contentRect.width - 8
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.right + 8
          break
      }

      // Ensure tooltip stays within viewport
      if (left < 8) left = 8
      if (left + contentRect.width > viewport.width - 8) {
        left = viewport.width - contentRect.width - 8
      }
      if (top < 8) top = 8
      if (top + contentRect.height > viewport.height - 8) {
        top = viewport.height - contentRect.height - 8
      }

      setPosition({ top, left })
    }

    useEffect(() => {
      if (isVisible) {
        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition)
      }

      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }, [isVisible, placement])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <div
        ref={ref}
        className={clsx('relative inline-block', className)}
        {...props}
      >
        <div
          ref={triggerRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
        >
          {children}
        </div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute z-50 max-w-xs rounded-lg bg-primary-900 px-3 py-2 text-sm text-primary-100 shadow-lg border border-primary-700"
              style={{
                top: position.top,
                left: position.left
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export default Tooltip
