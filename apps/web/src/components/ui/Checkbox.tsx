import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { clsx } from 'clsx'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    indeterminate = false,
    id,
    ...props 
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={clsx(
                'sr-only',
                className
              )}
              {...props}
            />
            
            <label
              htmlFor={checkboxId}
              className={clsx(
                'flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer',
                'bg-primary-700 border-primary-600',
                'hover:border-accent-500 hover:bg-primary-600',
                'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
                error && 'border-red-500',
                props.checked && 'bg-accent-500 border-accent-500 text-primary-900',
                indeterminate && 'bg-accent-500 border-accent-500 text-primary-900'
              )}
            >
              {props.checked && (
                <Check className="w-3 h-3" />
              )}
              {indeterminate && !props.checked && (
                <div className="w-2 h-0.5 bg-primary-900 rounded" />
              )}
            </label>
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox'

export default Checkbox
