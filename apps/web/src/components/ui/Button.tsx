import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-display font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'
    
    const variants = {
      primary: 'bg-gradient-to-r from-barber-gold to-barber-bronze hover:from-barber-bronze hover:to-barber-copper text-barber-black shadow-lg hover:shadow-gold focus:ring-barber-gold',
      secondary: 'bg-barber-steel hover:bg-barber-dark text-barber-platinum border border-barber-silver hover:border-barber-gold focus:ring-barber-silver',
      outline: 'border-2 border-barber-gold text-barber-gold hover:bg-barber-gold hover:text-barber-black focus:ring-barber-gold hover:shadow-gold',
      ghost: 'text-barber-silver hover:text-barber-gold hover:bg-barber-steel/20 focus:ring-barber-silver',
      destructive: 'bg-barber-crimson hover:bg-barber-burgundy text-white focus:ring-barber-crimson shadow-lg hover:shadow-red-500'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }

    return (
      <motion.button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 rtl:ml-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2 rtl:ml-2">{icon}</span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2 rtl:mr-2">{icon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
