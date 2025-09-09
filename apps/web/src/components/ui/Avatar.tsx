import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className,
    src,
    alt = 'Avatar',
    fallback,
    size = 'md',
    shape = 'circle',
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    }

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-lg'
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'relative inline-flex items-center justify-center overflow-hidden',
          'bg-accent-500 text-primary-900 font-semibold',
          sizes[size],
          shapes[shape],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="select-none">
            {fallback || alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
