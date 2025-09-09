import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className,
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
    ...props 
  }, ref) => {
    const variants = {
      text: 'h-4 w-full',
      rectangular: 'w-full',
      circular: 'rounded-full'
    }

    const animations = {
      pulse: 'animate-pulse',
      wave: 'animate-pulse',
      none: ''
    }

    const style = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'bg-primary-700 rounded',
          variants[variant],
          animations[animation],
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
