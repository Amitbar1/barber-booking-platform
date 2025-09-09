import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string; disabled?: boolean }[]
  name: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    options,
    name,
    id,
    ...props 
  }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <fieldset>
            <legend className="block text-sm font-medium text-primary-200 mb-3">
              {label}
            </legend>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.value} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="relative flex items-center">
                    <input
                      ref={index === 0 ? ref : undefined}
                      type="radio"
                      id={`${radioId}-${index}`}
                      name={name}
                      value={option.value}
                      disabled={option.disabled}
                      className={clsx(
                        'w-4 h-4 text-accent-500 bg-primary-700 border-primary-600',
                        'focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-red-500',
                        className
                      )}
                      {...props}
                    />
                  </div>
                  
                  <label
                    htmlFor={`${radioId}-${index}`}
                    className={clsx(
                      'text-sm font-medium text-primary-200 cursor-pointer',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        )}
        
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

Radio.displayName = 'Radio'

export default Radio
