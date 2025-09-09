import { forwardRef, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  showValue?: boolean
  showTicks?: boolean
  showLabels?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ 
    className,
    value = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    error,
    label,
    helperText,
    showValue = false,
    showTicks = false,
    showLabels = false,
    orientation = 'horizontal',
    size = 'md',
    color = 'accent',
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [currentValue, setCurrentValue] = useState(value)
    const sliderRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    }

    const thumbSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const colors = {
      primary: 'bg-primary-500',
      accent: 'bg-accent-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    }

    const percentage = ((currentValue - min) / (max - min)) * 100

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      handleMouseMove(e)
    }

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
      if (disabled || !sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const isVertical = orientation === 'vertical'
      
      let newValue: number
      if (isVertical) {
        const y = e.clientY - rect.top
        const percentage = Math.max(0, Math.min(1, 1 - (y / rect.height)))
        newValue = min + (max - min) * percentage
      } else {
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, x / rect.width))
        newValue = min + (max - min) * percentage
      }

      const steppedValue = Math.round(newValue / step) * step
      const clampedValue = Math.max(min, Math.min(max, steppedValue))
      
      setCurrentValue(clampedValue)
      onChange?.(clampedValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }, [isDragging])

    useEffect(() => {
      setCurrentValue(value)
    }, [value])

    const generateTicks = () => {
      if (!showTicks) return null

      const ticks = []
      const tickCount = 5
      const tickStep = (max - min) / (tickCount - 1)

      for (let i = 0; i < tickCount; i++) {
        const tickValue = min + (i * tickStep)
        const tickPercentage = ((tickValue - min) / (max - min)) * 100
        
        ticks.push(
          <div
            key={i}
            className={clsx(
              'absolute w-1 bg-primary-600',
              orientation === 'horizontal' ? 'h-2' : 'w-2 h-1'
            )}
            style={{
              [orientation === 'horizontal' ? 'left' : 'top']: `${tickPercentage}%`,
              [orientation === 'horizontal' ? 'top' : 'left']: '50%',
              transform: orientation === 'horizontal' 
                ? 'translateY(-50%)' 
                : 'translateX(-50%)'
            }}
          />
        )
      }

      return ticks
    }

    const generateLabels = () => {
      if (!showLabels) return null

      return (
        <div className={clsx(
          'flex justify-between text-xs text-primary-400 mt-2',
          orientation === 'vertical' && 'flex-col h-full'
        )}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-primary-200 mb-2">
            {label}
          </label>
        )}
        
        <div className={clsx(
          'relative',
          orientation === 'vertical' ? 'h-48 w-8' : 'w-full h-8',
          className
        )}>
          {/* Track */}
          <div
            ref={sliderRef}
            className={clsx(
              'relative rounded-full bg-primary-700 cursor-pointer',
              sizes[size],
              orientation === 'vertical' && 'w-full h-full',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onMouseDown={handleMouseDown}
          >
            {/* Progress */}
            <div
              className={clsx(
                'absolute rounded-full',
                colors[color],
                orientation === 'horizontal' 
                  ? 'h-full' 
                  : 'w-full bottom-0'
              )}
              style={{
                [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%`
              }}
            />

            {/* Thumb */}
            <motion.div
              ref={thumbRef}
              className={clsx(
                'absolute rounded-full bg-white border-2 border-current shadow-lg cursor-grab active:cursor-grabbing',
                thumbSizes[size],
                colors[color],
                disabled && 'cursor-not-allowed'
              )}
              style={{
                [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
                [orientation === 'horizontal' ? 'top' : 'left']: '50%',
                transform: orientation === 'horizontal' 
                  ? 'translate(-50%, -50%)' 
                  : 'translate(-50%, 50%)'
              }}
              whileHover={{ scale: disabled ? 1 : 1.1 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
            />

            {/* Ticks */}
            {generateTicks()}
          </div>

          {/* Labels */}
          {generateLabels()}
        </div>

        {/* Value display */}
        {showValue && (
          <div className="mt-2 text-sm text-primary-400 text-center">
            {currentValue}
          </div>
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

Slider.displayName = 'Slider'

export default Slider
