import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical' | 'both'
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  defaultWidth?: number
  defaultHeight?: number
  onResize?: (width: number, height: number) => void
}

const Resizable = forwardRef<HTMLDivElement, ResizableProps>(
  ({ 
    className,
    children,
    direction = 'both',
    minWidth = 100,
    maxWidth = 800,
    minHeight = 100,
    maxHeight = 600,
    defaultWidth = 300,
    defaultHeight = 200,
    onResize,
    ...props 
  }, ref) => {
    const [dimensions, setDimensions] = useState({
      width: defaultWidth,
      height: defaultHeight
    })
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const startPosRef = useRef({ x: 0, y: 0 })
    const startSizeRef = useRef({ width: 0, height: 0 })

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startPosRef.current = { x: e.clientX, y: e.clientY }
      startSizeRef.current = { ...dimensions }
    }, [dimensions])

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startPosRef.current.x
      const deltaY = e.clientY - startPosRef.current.y

      let newWidth = startSizeRef.current.width
      let newHeight = startSizeRef.current.height

      if (direction === 'horizontal' || direction === 'both') {
        newWidth = Math.min(Math.max(startSizeRef.current.width + deltaX, minWidth), maxWidth)
      }

      if (direction === 'vertical' || direction === 'both') {
        newHeight = Math.min(Math.max(startSizeRef.current.height + deltaY, minHeight), maxHeight)
      }

      setDimensions({ width: newWidth, height: newHeight })
      onResize?.(newWidth, newHeight)
    }, [isResizing, direction, minWidth, maxWidth, minHeight, maxHeight, onResize])

    const handleMouseUp = useCallback(() => {
      setIsResizing(false)
    }, [])

    useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = 'resizing'
        document.body.style.userSelect = 'none'
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }, [isResizing, handleMouseMove, handleMouseUp])

    return (
      <div
        ref={ref}
        className={clsx(
          'relative inline-block',
          className
        )}
        {...props}
      >
        <motion.div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            width: dimensions.width,
            height: dimensions.height
          }}
          animate={{
            width: dimensions.width,
            height: dimensions.height
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Resize handles */}
        {direction === 'horizontal' || direction === 'both' ? (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent-500/50 transition-colors"
            onMouseDown={handleMouseDown}
          />
        ) : null}

        {direction === 'vertical' || direction === 'both' ? (
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-accent-500/50 transition-colors"
            onMouseDown={handleMouseDown}
          />
        ) : null}

        {direction === 'both' ? (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize hover:bg-accent-500/50 transition-colors"
            onMouseDown={handleMouseDown}
          />
        ) : null}
      </div>
    )
  }
)

Resizable.displayName = 'Resizable'

export default Resizable
