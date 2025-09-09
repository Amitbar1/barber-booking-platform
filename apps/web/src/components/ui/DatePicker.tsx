import { forwardRef, useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import Calendar from './Calendar'

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  format?: string
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ 
    className,
    value,
    onChange,
    placeholder = 'בחר תאריך',
    disabled = false,
    error,
    label,
    helperText,
    minDate,
    maxDate,
    disabledDates,
    format = 'dd/mm/yyyy',
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      
      return format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year)
    }

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date)
      onChange?.(date)
      setIsOpen(false)
    }

    const handleClear = () => {
      setSelectedDate(null)
      onChange?.(null)
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-primary-200 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200',
              'bg-primary-700 border-primary-600 text-primary-100 placeholder-primary-400',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
              'hover:border-accent-500/50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <span className={clsx(
              selectedDate ? 'text-primary-100' : 'text-primary-400'
            )}>
              {selectedDate ? formatDate(selectedDate) : placeholder}
            </span>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {selectedDate && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="text-primary-400 hover:text-primary-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <CalendarIcon className="w-4 h-4 text-primary-400" />
            </div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 rtl:right-0 mt-2 z-50"
              >
                <Calendar
                  value={selectedDate || undefined}
                  onChange={handleDateSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                />
              </motion.div>
            )}
          </AnimatePresence>
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

DatePicker.displayName = 'DatePicker'

export default DatePicker
