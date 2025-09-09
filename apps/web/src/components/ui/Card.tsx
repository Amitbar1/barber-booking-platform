import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  hover?: boolean
  clickable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default',
    hover = false,
    clickable = false,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300'
    
    const variants = {
      default: 'bg-gradient-to-br from-barber-charcoal to-barber-dark border border-barber-steel shadow-xl hover:shadow-gold',
      elevated: 'bg-gradient-to-br from-barber-charcoal to-barber-dark border border-barber-steel shadow-2xl hover:shadow-gold',
      outlined: 'bg-transparent border-2 border-barber-gold hover:bg-barber-steel/10',
      filled: 'bg-barber-steel border border-barber-silver hover:border-barber-gold'
    }
    
    const hoverClasses = hover ? 'hover:border-accent-500/50 hover:shadow-lg' : ''
    const clickableClasses = clickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''

    return (
      <motion.div
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          hoverClasses,
          clickableClasses,
          className
        )}
        whileHover={clickable ? { y: -2 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1.5 p-6 pb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx('text-2xl font-semibold leading-none tracking-tight text-primary-100', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-primary-400', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
