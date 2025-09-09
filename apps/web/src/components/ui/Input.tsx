import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-primary-200 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
              <span className="text-primary-400">{icon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
              'bg-barber-steel border-barber-silver text-barber-platinum placeholder-barber-olive',
              'focus:border-barber-gold focus:ring-barber-gold/20',
              error && 'border-barber-crimson focus:border-barber-crimson focus:ring-barber-crimson/20',
              icon && iconPosition === 'left' && 'pl-10 rtl:pr-10',
              icon && iconPosition === 'right' && 'pr-10 rtl:pl-10',
              className
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 rtl:left-0 pr-3 rtl:pl-3 flex items-center pointer-events-none">
              <span className="text-primary-400">{icon}</span>
            </div>
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

Input.displayName = 'Input'

export default Input
