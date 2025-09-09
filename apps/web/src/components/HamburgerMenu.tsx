import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { 
  X, 
  Home, 
  Calendar, 
  Scissors, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
  currentPage?: string
}

const HamburgerMenu = ({ isOpen, onClose, currentPage = '' }: HamburgerMenuProps) => {

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const menuItems = [
    { 
      id: 'home', 
      label: 'דף הבית', 
      icon: Home, 
      href: '/',
      active: currentPage === 'home'
    },
    { 
      id: 'bookings', 
      label: 'הזמנת תור', 
      icon: Calendar, 
      href: '/booking/1',
      active: currentPage === 'bookings'
    },
    { 
      id: 'salon', 
      label: 'המספרה', 
      icon: Scissors, 
      href: '/salon/1',
      active: currentPage === 'salon'
    },
    { 
      id: 'admin', 
      label: 'ניהול', 
      icon: Settings, 
      href: '/admin',
      active: currentPage === 'admin'
    }
  ]

  const handleItemClick = (href: string) => {
    handleClose()
    // Small delay to allow animation to complete
    setTimeout(() => {
      window.location.href = href
    }, 200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed right-0 rtl:left-0 top-0 h-full w-full max-w-sm bg-surface border-l border-r border-border z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Logo size="md" className="text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-text">Padel Pro Israel</h2>
                  <p className="text-xs text-muted">ממשק ניהול</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-hover transition-colors"
                aria-label="סגור תפריט"
              >
                <X className="w-6 h-6 text-muted" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item.href)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                          item.active
                            ? 'bg-primary text-onPrimary shadow-lg'
                            : 'text-text hover:bg-surface-hover'
                        }`}
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Theme Toggle */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">נושא</span>
                <ThemeToggle />
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="mt-auto p-4 border-t border-border">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-onPrimary font-semibold">ד</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">דוד כהן</p>
                  <p className="text-xs text-muted">מספרת דוד</p>
                </div>
              </div>
              
              <button className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 text-error hover:bg-error/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">התנתק</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default HamburgerMenu
