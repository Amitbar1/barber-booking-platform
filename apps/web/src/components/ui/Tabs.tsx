import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className,
    defaultValue,
    value,
    onValueChange,
    orientation = 'horizontal',
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '')
    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'w-full',
          orientation === 'vertical' ? 'flex' : 'block',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex rounded-lg bg-primary-700 p-1',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className
        )}
        {...props}
      />
    )
  }
)

TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  active?: boolean
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          active
            ? 'bg-accent-500 text-primary-900 shadow-sm'
            : 'text-primary-300 hover:bg-primary-600 hover:text-primary-100',
          className
        )}
        {...props}
      />
    )
  }
)

TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  active?: boolean
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, active, ...props }, ref) => {
    if (!active) return null

    return (
      <div
        ref={ref}
        className={clsx(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    )
  }
)

TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
