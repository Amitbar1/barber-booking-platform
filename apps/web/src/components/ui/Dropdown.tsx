import { forwardRef, useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  align?: 'start' | 'center' | 'end'
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ 
    className,
    trigger,
    children,
    open: controlledOpen,
    onOpenChange,
    placement = 'bottom-start',
    align = 'start',
    ...props 
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLButtonElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    const handleOpenChange = (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    }

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let top = triggerRect.bottom + 8
      let left = triggerRect.left

      // Adjust for placement
      if (placement.includes('top')) {
        top = triggerRect.top - contentRect.height - 8
      }

      if (placement.includes('end')) {
        left = triggerRect.right - contentRect.width
      }

      // Adjust for align
      if (align === 'center') {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
      } else if (align === 'end') {
        left = triggerRect.right - contentRect.width
      }

      // Ensure content stays within viewport
      if (left < 8) left = 8
      if (left + contentRect.width > viewport.width - 8) {
        left = viewport.width - contentRect.width - 8
      }

      setPosition({ top, left })
    }

    useEffect(() => {
      if (isOpen) {
        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition)
      }

      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }, [isOpen, placement, align])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current?.contains(event.target as Node) ||
          contentRef.current?.contains(event.target as Node)
        ) {
          return
        }
        handleOpenChange(false)
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    return (
      <div
        ref={ref}
        className={clsx('relative inline-block', className)}
        {...props}
      >
        <button
          ref={triggerRef}
          onClick={() => handleOpenChange(!isOpen)}
          className="w-full"
        >
          {trigger}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-primary-700 bg-primary-800 shadow-xl"
              style={{
                top: position.top,
                left: position.left
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: React.ReactNode
  destructive?: boolean
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, icon, destructive = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'flex w-full items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm transition-colors',
          'hover:bg-primary-700 focus:bg-primary-700 focus:outline-none',
          destructive
            ? 'text-red-400 hover:text-red-300'
            : 'text-primary-200 hover:text-primary-100',
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </button>
    )
  }
)

DropdownItem.displayName = 'DropdownItem'

interface DropdownSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('h-px bg-primary-700', className)}
        {...props}
      />
    )
  }
)

DropdownSeparator.displayName = 'DropdownSeparator'

export { Dropdown, DropdownItem, DropdownSeparator }
