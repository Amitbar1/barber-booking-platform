import { forwardRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { clsx } from 'clsx'

interface ScheduleCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  availableDates?: Date[]
  unavailableDates?: Date[]
  view?: 'month' | 'week' | 'day'
  onViewChange?: (view: 'month' | 'week' | 'day') => void
  showTimeSlots?: boolean
  timeSlots?: {
    time: string
    isAvailable: boolean
    isBooked?: boolean
  }[]
  onTimeSlotSelect?: (time: string) => void
}

const ScheduleCalendar = forwardRef<HTMLDivElement, ScheduleCalendarProps>(
  ({ 
    className,
    selectedDate = new Date(),
    onDateSelect,
    availableDates = [],
    unavailableDates = [],
    view: _view = 'month',
    onViewChange: _onViewChange,
    showTimeSlots = false,
    timeSlots = [],
    onTimeSlotSelect,
    ...props 
  }, ref) => {
    const [currentDate, setCurrentDate] = useState(selectedDate)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ]

    const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

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

    const isDateAvailable = (date: Date) => {
      return availableDates.some(availableDate => 
        date.toDateString() === availableDate.toDateString()
      )
    }

    const isDateUnavailable = (date: Date) => {
      return unavailableDates.some(unavailableDate => 
        date.toDateString() === unavailableDate.toDateString()
      )
    }

    const isDateSelected = (date: Date) => {
      return selectedDate && date.toDateString() === selectedDate.toDateString()
    }

    const isToday = (date: Date) => {
      return date.toDateString() === new Date().toDateString()
    }

    const handleDateClick = (date: Date) => {
      if (isDateAvailable(date) && !isDateUnavailable(date)) {
        onDateSelect?.(date)
      }
    }

    const handlePreviousMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleTimeSlotClick = (time: string) => {
      setSelectedTime(time)
      onTimeSlotSelect?.(time)
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'bg-gradient-to-br from-barber-charcoal to-barber-dark',
          'border border-barber-steel rounded-2xl p-6 shadow-xl',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Calendar className="w-6 h-6 text-barber-gold" />
            <h3 className="text-xl font-display font-bold text-barber-gold">
              לוח זמנים
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-barber-steel rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-barber-silver" />
            </button>
            
            <h2 className="text-lg font-display font-semibold text-barber-platinum min-w-[200px] text-center">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-barber-steel rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-barber-silver" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="mb-6">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((dayName) => (
              <div
                key={dayName}
                className="text-center text-sm font-medium text-barber-silver py-2"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-12" />
              }

              const available = isDateAvailable(date)
              const unavailable = isDateUnavailable(date)
              const selected = isDateSelected(date)
              const today = isToday(date)

              return (
                <motion.button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  disabled={!available || unavailable}
                  className={clsx(
                    'h-12 w-12 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-barber-gold',
                    available && !unavailable && 'cursor-pointer',
                    (!available || unavailable) && 'opacity-50 cursor-not-allowed',
                    selected && 'bg-barber-gold text-barber-black shadow-gold',
                    !selected && available && !unavailable && 'text-barber-platinum hover:bg-barber-steel hover:text-barber-gold',
                    !selected && (!available || unavailable) && 'text-barber-olive',
                    today && !selected && 'text-barber-gold font-bold'
                  )}
                  whileHover={available && !unavailable ? { scale: 1.05 } : {}}
                  whileTap={available && !unavailable ? { scale: 0.95 } : {}}
                >
                  {date.getDate()}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        {showTimeSlots && timeSlots.length > 0 && (
          <div className="border-t border-barber-steel pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Clock className="w-5 h-5 text-barber-bronze" />
              <h4 className="text-lg font-display font-semibold text-barber-platinum">
                זמנים זמינים
              </h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.time}
                  onClick={() => handleTimeSlotClick(slot.time)}
                  disabled={!slot.isAvailable || slot.isBooked}
                  className={clsx(
                    'p-3 rounded-xl text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-barber-gold',
                    slot.isAvailable && !slot.isBooked && 'cursor-pointer',
                    (!slot.isAvailable || slot.isBooked) && 'opacity-50 cursor-not-allowed',
                    selectedTime === slot.time && 'bg-barber-gold text-barber-black shadow-gold',
                    selectedTime !== slot.time && slot.isAvailable && !slot.isBooked && 'bg-barber-steel text-barber-platinum hover:bg-barber-gold hover:text-barber-black',
                    selectedTime !== slot.time && (!slot.isAvailable || slot.isBooked) && 'bg-barber-dark text-barber-olive'
                  )}
                  whileHover={slot.isAvailable && !slot.isBooked ? { scale: 1.05 } : {}}
                  whileTap={slot.isAvailable && !slot.isBooked ? { scale: 0.95 } : {}}
                >
                  {slot.time}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

ScheduleCalendar.displayName = 'ScheduleCalendar'

export default ScheduleCalendar
