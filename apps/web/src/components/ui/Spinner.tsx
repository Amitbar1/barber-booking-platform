import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'accent' | 'white'
  speed?: 'slow' | 'normal' | 'fast'
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ 
    className,
    size = 'md',
    color = 'accent',
    speed = 'normal',
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    }

    const colors = {
      primary: 'text-primary-500',
      accent: 'text-accent-500',
      white: 'text-white'
    }

    const speeds = {
      slow: 2,
      normal: 1,
      fast: 0.5
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'inline-block rounded-full border-2 border-current border-t-transparent',
          sizes[size],
          colors[color],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: speeds[speed], 
          repeat: Infinity, 
          ease: 'linear' 
        }}
        {...props}
      />
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
