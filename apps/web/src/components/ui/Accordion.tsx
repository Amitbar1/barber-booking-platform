import { forwardRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ 
    className,
    type = 'single',
    collapsible = true,
    defaultValue,
    value,
    onValueChange,
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue || (type === 'multiple' ? [] : '')
    )
    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string | string[]) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={clsx('w-full', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'border-b border-primary-700 last:border-b-0',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  active?: boolean
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all',
          'hover:bg-primary-700/50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    )
  }
)

AccordionTrigger.displayName = 'AccordionTrigger'

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  active?: boolean
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, active, children, ...props }, ref) => {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            ref={ref}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={clsx(
              'overflow-hidden',
              className
            )}
            {...props}
          >
            <div className="pb-4 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
