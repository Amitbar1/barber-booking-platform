import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { clsx } from 'clsx'

interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  disabled?: boolean
  onDragStart?: () => void
  onDragEnd?: (x: number, y: number) => void
  onDrag?: (x: number, y: number) => void
  bounds?: 'parent' | 'window' | { left?: number; right?: number; top?: number; bottom?: number }
  grid?: [number, number]
  snapToGrid?: boolean
}

const Draggable = forwardRef<HTMLDivElement, DraggableProps>(
  ({ 
    className,
    children,
    disabled = false,
    onDragStart,
    onDragEnd,
    onDrag,
    bounds,
    grid,
    snapToGrid = false,
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const startPosRef = useRef({ x: 0, y: 0 })

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const handleDragStart = useCallback(() => {
      if (disabled) return
      setIsDragging(true)
      onDragStart?.()
    }, [disabled, onDragStart])

    const handleDrag = useCallback((event: any, info: any) => {
      if (disabled) return

      let newX = info.point.x
      let newY = info.point.y

      // Apply bounds
      if (bounds === 'parent' && containerRef.current) {
        const parent = containerRef.current.parentElement
        if (parent) {
          const parentRect = parent.getBoundingClientRect()
          const elementRect = containerRef.current.getBoundingClientRect()
          newX = Math.min(Math.max(newX, 0), parentRect.width - elementRect.width)
          newY = Math.min(Math.max(newY, 0), parentRect.height - elementRect.height)
        }
      } else if (bounds === 'window') {
        newX = Math.min(Math.max(newX, 0), window.innerWidth - 100)
        newY = Math.min(Math.max(newY, 0), window.innerHeight - 100)
      } else if (bounds && typeof bounds === 'object') {
        if (bounds.left !== undefined) newX = Math.max(newX, bounds.left)
        if (bounds.right !== undefined) newX = Math.min(newX, bounds.right)
        if (bounds.top !== undefined) newY = Math.max(newY, bounds.top)
        if (bounds.bottom !== undefined) newY = Math.min(newY, bounds.bottom)
      }

      // Apply grid snapping
      if (snapToGrid && grid) {
        newX = Math.round(newX / grid[0]) * grid[0]
        newY = Math.round(newY / grid[1]) * grid[1]
      }

      setPosition({ x: newX, y: newY })
      onDrag?.(newX, newY)
    }, [disabled, bounds, grid, snapToGrid, onDrag])

    const handleDragEnd = useCallback(() => {
      if (disabled) return
      setIsDragging(false)
      onDragEnd?.(position.x, position.y)
    }, [disabled, position, onDragEnd])

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'relative inline-block',
          isDragging && 'z-50',
          disabled && 'cursor-not-allowed',
          className
        )}
        drag={!disabled}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className={clsx(
            'relative',
            isDragging && 'shadow-2xl'
          )}
        >
          {children}
        </div>
      </motion.div>
    )
  }
)

Draggable.displayName = 'Draggable'

export default Draggable
