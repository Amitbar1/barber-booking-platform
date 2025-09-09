import { useState, useEffect } from 'react'

export interface SalonTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  customFont: string
  brandLogo?: string
  favicon?: string
  metaTitle?: string
  metaDescription?: string
}

const defaultTheme: SalonTheme = {
  primaryColor: '#38BDF8',
  secondaryColor: '#0EA5E9',
  accentColor: '#FACC15',
  backgroundColor: '#0F172A',
  textColor: '#F1F5F9',
  customFont: 'Inter'
}

export const useSalonTheme = (salonId?: string) => {
  const [theme, setTheme] = useState<SalonTheme>(defaultTheme)
  const [isLoading, setIsLoading] = useState(false)

  // Load theme from API or localStorage
  useEffect(() => {
    const loadTheme = async () => {
      if (!salonId) return

      setIsLoading(true)
      try {
        // In real app, this would fetch from API
        const savedTheme = localStorage.getItem(`salon-theme-${salonId}`)
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme)
          setTheme({ ...defaultTheme, ...parsedTheme })
          applyTheme(parsedTheme)
        } else {
          // Try to fetch from API
          // const response = await fetch(`/api/salons/${salonId}/theme`)
          // const themeData = await response.json()
          // setTheme(themeData)
          // applyTheme(themeData)
        }
      } catch (error) {
        console.error('Failed to load theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [salonId])

  // Apply theme to document
  const applyTheme = (themeData: SalonTheme) => {
    const root = document.documentElement
    
    // Apply CSS custom properties
    root.style.setProperty('--primary', themeData.primaryColor)
    root.style.setProperty('--secondary', themeData.secondaryColor)
    root.style.setProperty('--accent', themeData.accentColor)
    root.style.setProperty('--bg', themeData.backgroundColor)
    root.style.setProperty('--text', themeData.textColor)
    root.style.setProperty('--font-family', themeData.customFont)
    
    // Apply font family to body
    document.body.style.fontFamily = themeData.customFont

    // Update favicon if provided
    if (themeData.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = themeData.favicon
      } else {
        const link = document.createElement('link')
        link.rel = 'icon'
        link.href = themeData.favicon
        document.head.appendChild(link)
      }
    }

    // Update meta title and description
    if (themeData.metaTitle) {
      document.title = themeData.metaTitle
    }
    
    if (themeData.metaDescription) {
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement
      if (metaDescription) {
        metaDescription.content = themeData.metaDescription
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = themeData.metaDescription
        document.head.appendChild(meta)
      }
    }
  }

  // Save theme
  const saveTheme = async (newTheme: SalonTheme) => {
    try {
      // In real app, this would save to API
      if (salonId) {
        localStorage.setItem(`salon-theme-${salonId}`, JSON.stringify(newTheme))
      }
      
      setTheme(newTheme)
      applyTheme(newTheme)
      
      // Simulate API call
      // await fetch(`/api/salons/${salonId}/theme`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newTheme)
      // })
    } catch (error) {
      console.error('Failed to save theme:', error)
      throw error
    }
  }

  // Reset to default theme
  const resetTheme = () => {
    setTheme(defaultTheme)
    applyTheme(defaultTheme)
    if (salonId) {
      localStorage.removeItem(`salon-theme-${salonId}`)
    }
  }

  return {
    theme,
    isLoading,
    saveTheme,
    resetTheme,
    applyTheme
  }
}
