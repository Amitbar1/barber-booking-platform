import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { X, Eye, Plus } from 'lucide-react'

const PageNavigator = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [pages, setPages] = useState([
    { path: '/', name: 'דף הבית', description: 'Landing Page' },
    { path: '/admin', name: 'לוח בקרה', description: 'Admin Dashboard' },
    { path: '/salon/1', name: 'דף מספרה', description: 'Salon Page' },
    { path: '/booking/1', name: 'הזמנת תור', description: 'Booking Page' },
    { path: '/404', name: 'דף שגיאה', description: 'Not Found Page' },
  ])
  const location = useLocation()
  const navigate = useNavigate()

  // Auto-add new pages when route changes
  useEffect(() => {
    const currentPath = location.pathname
    const pageExists = pages.some(page => page.path === currentPath)
    
    if (!pageExists) {
      const newPage = {
        path: currentPath,
        name: getPageName(currentPath),
        description: getPageDescription(currentPath)
      }
      setPages(prev => [...prev, newPage])
    }
  }, [location.pathname, pages])

  const getPageName = (path: string) => {
    if (path === '/') return 'דף הבית'
    if (path.startsWith('/admin')) return 'לוח בקרה'
    if (path.startsWith('/salon')) return 'דף מספרה'
    if (path.startsWith('/booking')) return 'הזמנת תור'
    if (path === '/404') return 'דף שגיאה'
    return `דף חדש: ${path}`
  }

  const getPageDescription = (path: string) => {
    if (path === '/') return 'Landing Page'
    if (path.startsWith('/admin')) return 'Admin Dashboard'
    if (path.startsWith('/salon')) return 'Salon Page'
    if (path.startsWith('/booking')) return 'Booking Page'
    if (path === '/404') return 'Not Found Page'
    return 'New Page'
  }

  const currentPage = pages.find(page => page.path === location.pathname) || 
    { path: location.pathname, name: 'דף לא ידוע', description: 'Unknown Page' }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-barber-gold hover:bg-barber-bronze text-barber-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        title="ניווט בין דפים"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Navigation Panel */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 bg-barber-charcoal border border-barber-steel rounded-xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-barber-gold font-display font-semibold text-lg">
              ניווט דפים
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-barber-silver hover:text-barber-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Page */}
          <div className="mb-4 p-3 bg-barber-dark rounded-lg border border-barber-gold/20">
            <div className="text-barber-gold font-medium text-sm">דף נוכחי:</div>
            <div className="text-barber-platinum font-semibold">{currentPage.name}</div>
            <div className="text-barber-silver text-xs">{currentPage.description}</div>
            <div className="text-barber-olive text-xs font-mono">{currentPage.path}</div>
          </div>

          {/* Page List */}
          <div className="space-y-2">
            <div className="text-barber-silver text-sm font-medium mb-2">דפים זמינים:</div>
            {pages.map((page) => (
              <button
                key={page.path}
                onClick={() => {
                  navigate(page.path)
                  setIsOpen(false)
                }}
                className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                  page.path === location.pathname
                    ? 'bg-barber-gold/20 border border-barber-gold text-barber-gold'
                    : 'bg-barber-steel hover:bg-barber-dark border border-barber-silver hover:border-barber-gold text-barber-platinum hover:text-barber-gold'
                }`}
              >
                <div className="font-medium">{page.name}</div>
                <div className="text-xs opacity-75">{page.description}</div>
                <div className="text-xs font-mono opacity-60">{page.path}</div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-barber-steel">
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-barber-steel hover:bg-barber-dark text-barber-platinum hover:text-barber-gold px-3 py-2 rounded-lg text-sm transition-colors"
              >
                רענן דף
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('הקישור הועתק ללוח!')
                }}
                className="flex-1 bg-barber-steel hover:bg-barber-dark text-barber-platinum hover:text-barber-gold px-3 py-2 rounded-lg text-sm transition-colors"
              >
                העתק קישור
              </button>
            </div>
            
            {/* Add Current Page Button */}
            <div className="mt-2">
              <button
                onClick={() => {
                  const currentPath = location.pathname
                  const pageExists = pages.some(page => page.path === currentPath)
                  
                  if (!pageExists) {
                    const newPage = {
                      path: currentPath,
                      name: getPageName(currentPath),
                      description: getPageDescription(currentPath)
                    }
                    setPages(prev => [...prev, newPage])
                    alert(`דף ${newPage.name} נוסף לרשימה!`)
                  } else {
                    alert('הדף כבר קיים ברשימה!')
                  }
                }}
                className="w-full bg-barber-gold hover:bg-barber-bronze text-barber-black px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                הוסף דף נוכחי
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageNavigator
