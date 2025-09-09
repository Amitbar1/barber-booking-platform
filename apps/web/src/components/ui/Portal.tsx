import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  container?: HTMLElement | null
  disablePortal?: boolean
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({ 
    children,
    container,
    disablePortal = false,
    ...props 
  }, ref) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (disablePortal || !mounted) {
      return <div ref={ref} {...props}>{children}</div>
    }

    const targetContainer = container || document.body

    return createPortal(
      <div ref={ref} {...props}>
        {children}
      </div>,
      targetContainer
    )
  }
)

Portal.displayName = 'Portal'

export default Portal
