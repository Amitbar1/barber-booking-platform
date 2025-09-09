import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, ArrowLeft } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import HamburgerMenu from './HamburgerMenu'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBackClick?: () => void
  currentPage?: string
  className?: string
}

const Header = ({ 
  title, 
  showBackButton = false, 
  onBackClick,
  currentPage = '',
  className = ''
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      window.history.back()
    }
  }

  return (
    <>
      <header className={`bg-surface/95 backdrop-blur-md border-b border-border sticky top-0 z-30 shadow-sm ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button or Logo */}
            <div className="flex items-center">
              {showBackButton ? (
                <button 
                  onClick={handleBackClick}
                  className="flex items-center text-muted hover:text-primary transition-colors p-2 -ml-2"
                  aria-label="חזור"
                >
                  <ArrowLeft className="w-5 h-5 ml-2 rtl:mr-2" />
                  <span className="hidden sm:inline">חזור</span>
                </button>
              ) : (
                <motion.div 
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Logo size="md" className="text-primary" />
                  <span className="text-xl font-bold text-text hidden sm:inline">Padel Pro Israel</span>
                </motion.div>
              )}
            </div>

            {/* Center - Title */}
            {title && (
              <h1 className="text-lg font-semibold text-text text-center flex-1 max-w-xs truncate">
                {title}
              </h1>
            )}

            {/* Right side - Theme toggle and Menu */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Desktop Theme Toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-hover transition-colors"
                aria-label="פתח תפריט"
              >
                <Menu className="w-6 h-6 text-muted" />
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
                <a 
                  href="/" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                    currentPage === 'home' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  דף הבית
                </a>
                <a 
                  href="/booking/1" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                    currentPage === 'bookings' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  הזמנת תור
                </a>
                <a 
                  href="/salon/1" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                    currentPage === 'salon' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  המספרה
                </a>
                <a 
                  href="/admin" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                    currentPage === 'admin' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  ניהול
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentPage={currentPage}
      />
    </>
  )
}

export default Header
