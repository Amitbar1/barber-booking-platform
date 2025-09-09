import { forwardRef, useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  locale?: string
  showWeekNumbers?: boolean
  showToday?: boolean
  showNavigation?: boolean
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ 
    className,
    value,
    onChange,
    minDate,
    maxDate,
    disabledDates = [],
    locale: _locale = 'he-IL',
    showWeekNumbers: _showWeekNumbers = false,
    showToday = true,
    showNavigation = true,
    ...props 
  }, ref) => {
    const [currentDate, setCurrentDate] = useState(value || new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)

    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ]

    const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

    const days = useMemo(() => {
      const daysArray = []
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        daysArray.push(null)
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(new Date(year, month, day))
      }
      
      return daysArray
    }, [year, month, firstDayOfWeek, daysInMonth])

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some(disabledDate => 
        date.toDateString() === disabledDate.toDateString()
      )
    }

    const isDateSelected = (date: Date) => {
      return selectedDate && date.toDateString() === selectedDate.toDateString()
    }

    const isToday = (date: Date) => {
      return date.toDateString() === today.toDateString()
    }

    const handleDateClick = (date: Date) => {
      if (isDateDisabled(date)) return
      
      setSelectedDate(date)
      onChange?.(date)
    }

    const handlePreviousMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleTodayClick = () => {
      setCurrentDate(today)
      setSelectedDate(today)
      onChange?.(today)
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'w-full max-w-sm mx-auto bg-primary-800 rounded-lg border border-primary-700 p-4',
          className
        )}
        {...props}
      >
        {/* Header */}
        {showNavigation && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <h2 className="text-lg font-semibold text-primary-100">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="text-center text-sm font-medium text-primary-400 py-2"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10" />
            }

            const disabled = isDateDisabled(date)
            const selected = isDateSelected(date)
            const today = isToday(date)

            return (
              <motion.button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={clsx(
                  'h-10 w-10 rounded-lg text-sm font-medium transition-colors',
                  'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500',
                  disabled && 'opacity-50 cursor-not-allowed',
                  selected && 'bg-accent-500 text-primary-900',
                  !selected && !disabled && 'text-primary-200 hover:text-primary-100',
                  today && !selected && 'text-accent-400 font-bold'
                )}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
              >
                {date.getDate()}
              </motion.button>
            )
          })}
        </div>

        {/* Today button */}
        {showToday && (
          <div className="mt-4 text-center">
            <button
              onClick={handleTodayClick}
              className="text-sm text-accent-500 hover:text-accent-400 transition-colors"
            >
              היום
            </button>
          </div>
        )}
      </div>
    )
  }
)

Calendar.displayName = 'Calendar'

export default Calendar
