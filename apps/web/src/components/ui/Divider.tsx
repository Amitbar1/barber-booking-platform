import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ 
    className,
    orientation = 'horizontal',
    variant = 'solid',
    thickness = 'thin',
    ...props 
  }, ref) => {
    const orientations = {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px'
    }

    const variants = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    }

    const thicknesses = {
      thin: 'border-t rtl:border-t',
      medium: 'border-t-2 rtl:border-t-2',
      thick: 'border-t-4 rtl:border-t-4'
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'border-primary-700',
          orientations[orientation],
          variants[variant],
          thicknesses[thickness],
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

export default Divider
