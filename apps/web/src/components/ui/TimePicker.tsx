import { forwardRef, useState } from 'react'
import { Clock, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  format?: '12h' | '24h'
  step?: number
  minTime?: string
  maxTime?: string
}

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  ({ 
    className,
    value,
    onChange,
    placeholder = 'בחר שעה',
    disabled = false,
    error,
    label,
    helperText,
    format = '24h',
    step = 15,
    minTime,
    maxTime,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(value || '')
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM')

    const generateTimeOptions = () => {
      const options = []
      const maxHour = format === '12h' ? 12 : 23
      const minHour = format === '12h' ? 1 : 0
      
      for (let h = minHour; h <= maxHour; h++) {
        for (let m = 0; m < 60; m += step) {
          const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
          const time12 = format === '12h' ? convertTo12Hour(time24) : time24
          
          if (isTimeInRange(time24)) {
            options.push({
              value: time24,
              label: time12,
              hour: h,
              minute: m
            })
          }
        }
      }
      
      return options
    }

    const convertTo12Hour = (time24: string) => {
      const [hours, minutes] = time24.split(':').map(Number)
      const period = hours >= 12 ? 'PM' : 'AM'
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
    }

    const isTimeInRange = (time: string) => {
      if (minTime && time < minTime) return false
      if (maxTime && time > maxTime) return false
      return true
    }

    const handleTimeSelect = (time: string) => {
      setSelectedTime(time)
      onChange?.(time)
      setIsOpen(false)
    }

    const handleHoursChange = (newHours: number) => {
      const newTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      if (isTimeInRange(newTime)) {
        setHours(newHours)
        handleTimeSelect(newTime)
      }
    }

    const handleMinutesChange = (newMinutes: number) => {
      const newTime = `${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
      if (isTimeInRange(newTime)) {
        setMinutes(newMinutes)
        handleTimeSelect(newTime)
      }
    }

    const timeOptions = generateTimeOptions()

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
              selectedTime ? 'text-primary-100' : 'text-primary-400'
            )}>
              {selectedTime ? (format === '12h' ? convertTo12Hour(selectedTime) : selectedTime) : placeholder}
            </span>
            
            <Clock className="w-4 h-4 text-primary-400" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 rtl:right-0 mt-2 z-50 w-full bg-primary-800 rounded-lg border border-primary-700 shadow-xl p-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Hours */}
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-2">
                      שעות
                    </label>
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleHoursChange(hours + 1)}
                        className="p-1 hover:bg-primary-700 rounded transition-colors"
                      >
                        <ChevronUp className="w-4 h-4 text-primary-400" />
                      </button>
                      
                      <div className="text-2xl font-bold text-primary-100 min-w-[3rem] text-center">
                        {hours.toString().padStart(2, '0')}
                      </div>
                      
                      <button
                        onClick={() => handleHoursChange(hours - 1)}
                        className="p-1 hover:bg-primary-700 rounded transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 text-primary-400" />
                      </button>
                    </div>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-2">
                      דקות
                    </label>
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleMinutesChange(minutes + step)}
                        className="p-1 hover:bg-primary-700 rounded transition-colors"
                      >
                        <ChevronUp className="w-4 h-4 text-primary-400" />
                      </button>
                      
                      <div className="text-2xl font-bold text-primary-100 min-w-[3rem] text-center">
                        {minutes.toString().padStart(2, '0')}
                      </div>
                      
                      <button
                        onClick={() => handleMinutesChange(minutes - step)}
                        className="p-1 hover:bg-primary-700 rounded transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 text-primary-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time options */}
                <div className="mt-4 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-1">
                    {timeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleTimeSelect(option.value)}
                        className={clsx(
                          'px-3 py-2 text-sm rounded transition-colors',
                          'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500',
                          selectedTime === option.value && 'bg-accent-500 text-primary-900'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
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

TimePicker.displayName = 'TimePicker'

export default TimePicker
