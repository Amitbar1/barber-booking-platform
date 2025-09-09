import { forwardRef, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'vertical' | 'horizontal' | 'both'
  scrollbar?: 'auto' | 'always' | 'hover' | 'never'
  size?: 'sm' | 'md' | 'lg'
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ 
    className,
    children,
    orientation = 'vertical',
    scrollbar = 'auto',
    size = 'md',
    ...props 
  }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollState, setScrollState] = useState({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      clientHeight: 0,
      clientWidth: 0
    })

    const sizes = {
      sm: 'scrollbar-thin',
      md: 'scrollbar',
      lg: 'scrollbar-thick'
    }

    const scrollbarClasses = {
      auto: 'scrollbar-auto',
      always: 'scrollbar-always',
      hover: 'scrollbar-hover',
      never: 'scrollbar-none'
    }

    const orientations = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto'
    }

    useEffect(() => {
      const element = scrollRef.current
      if (!element) return

      const updateScrollState = () => {
        setScrollState({
          scrollTop: element.scrollTop,
          scrollLeft: element.scrollLeft,
          scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth,
          clientHeight: element.clientHeight,
          clientWidth: element.clientWidth
        })
      }

      updateScrollState()
      element.addEventListener('scroll', updateScrollState)
      window.addEventListener('resize', updateScrollState)

      return () => {
        element.removeEventListener('scroll', updateScrollState)
        window.removeEventListener('resize', updateScrollState)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden',
          className
        )}
        {...props}
      >
        <div
          ref={scrollRef}
          className={clsx(
            'h-full w-full',
            orientations[orientation],
            sizes[size],
            scrollbarClasses[scrollbar],
            'scrollbar-track-primary-800 scrollbar-thumb-primary-600 hover:scrollbar-thumb-primary-500'
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea
