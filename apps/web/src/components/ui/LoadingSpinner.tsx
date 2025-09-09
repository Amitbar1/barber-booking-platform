import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'accent' | 'white'
  className?: string
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'accent', 
  className 
}: LoadingSpinnerProps) => {
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

  return (
    <motion.div
      className={clsx(
        'inline-block rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        colors[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default LoadingSpinner
