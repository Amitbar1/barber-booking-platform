import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    size = 'md',
    id,
    ...props 
  }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`
    
    const sizes = {
      sm: 'w-8 h-4',
      md: 'w-11 h-6',
      lg: 'w-14 h-8'
    }
    
    const thumbSizes = {
      sm: 'w-3 h-3',
      md: 'w-5 h-5',
      lg: 'w-7 h-7'
    }
    
    return (
      <div className="w-full">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              className="sr-only"
              {...props}
            />
            
            <label
              htmlFor={switchId}
              className={clsx(
                'relative inline-flex cursor-pointer transition-colors duration-200',
                'bg-primary-600 rounded-full',
                'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
                props.checked && 'bg-accent-500',
                error && 'ring-2 ring-red-500',
                sizes[size],
                className
              )}
            >
              <span
                className={clsx(
                  'inline-block rounded-full bg-white transition-transform duration-200',
                  'shadow-lg transform',
                  props.checked ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1',
                  thumbSizes[size]
                )}
              />
            </label>
          </div>
          
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-primary-200 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-primary-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
