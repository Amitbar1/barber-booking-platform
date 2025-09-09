import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RotateCcw,
  Image as ImageIcon,
  Globe,
  Search
} from 'lucide-react'

interface BrandingData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  customFont: string
  brandLogo: string
  favicon: string
  metaTitle: string
  metaDescription: string
}

const BrandingSettings = () => {
  const [brandingData, setBrandingData] = useState<BrandingData>({
    primaryColor: '#38BDF8',
    secondaryColor: '#0EA5E9',
    accentColor: '#FACC15',
    backgroundColor: '#0F172A',
    textColor: '#F1F5F9',
    customFont: 'Inter',
    brandLogo: '',
    favicon: '',
    metaTitle: '',
    metaDescription: ''
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'colors' | 'logo' | 'seo'>('colors')

  const handleColorChange = (field: keyof BrandingData, value: string) => {
    setBrandingData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: 'brandLogo' | 'favicon', file: File) => {
    // In real app, this would upload to cloud storage
    const url = URL.createObjectURL(file)
    setBrandingData(prev => ({ ...prev, [field]: url }))
  }

  const resetToDefaults = () => {
    setBrandingData({
      primaryColor: '#38BDF8',
      secondaryColor: '#0EA5E9',
      accentColor: '#FACC15',
      backgroundColor: '#0F172A',
      textColor: '#F1F5F9',
      customFont: 'Inter',
      brandLogo: '',
      favicon: '',
      metaTitle: '',
      metaDescription: ''
    })
  }

  const saveSettings = () => {
    // In real app, this would save to API
    console.log('Saving branding settings:', brandingData)
  }

  const previewStyles = {
    '--primary': brandingData.primaryColor,
    '--secondary': brandingData.secondaryColor,
    '--accent': brandingData.accentColor,
    '--bg': brandingData.backgroundColor,
    '--text': brandingData.textColor,
    '--font-family': brandingData.customFont
  } as React.CSSProperties

  const tabs = [
    { id: 'colors', label: 'צבעים', icon: Palette },
    { id: 'logo', label: 'לוגו', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Search }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">הגדרות עיצוב</h2>
          <p className="text-muted mt-1">התאם את העיצוב של המספרה שלך</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isPreviewMode 
                ? 'bg-primary text-onPrimary border-primary' 
                : 'bg-surface border-border text-text hover:bg-surface-hover'
            }`}
          >
            <Eye className="w-4 h-4 ml-2 rtl:mr-2" />
            {isPreviewMode ? 'יציאה מתצוגה מקדימה' : 'תצוגה מקדימה'}
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 rounded-lg border border-border text-text hover:bg-surface-hover transition-colors"
          >
            <RotateCcw className="w-4 h-4 ml-2 rtl:mr-2" />
            איפוס
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 rounded-lg bg-primary text-onPrimary hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4 ml-2 rtl:mr-2" />
            שמור
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      {isPreviewMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
          style={previewStyles}
        >
          <h3 className="text-lg font-semibold mb-4 text-text">תצוגה מקדימה</h3>
          <div className="space-y-4">
            {/* Preview Card */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg)', 
                color: 'var(--text)',
                borderColor: 'var(--primary)',
                fontFamily: 'var(--font-family)'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                {brandingData.brandLogo && (
                  <img 
                    src={brandingData.brandLogo} 
                    alt="Logo" 
                    className="w-8 h-8 rounded"
                  />
                )}
                <h4 className="font-semibold">מספרת דוד</h4>
              </div>
              <p className="text-sm opacity-80 mb-3">תספורת מקצועית לגברים</p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--bg)' 
                  }}
                >
                  הזמן תור
                </button>
                <button 
                  className="px-3 py-1 rounded text-sm border"
                  style={{ 
                    borderColor: 'var(--secondary)', 
                    color: 'var(--secondary)' 
                  }}
                >
                  מידע נוסף
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 rtl:space-x-reverse bg-surface rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-onPrimary'
                  : 'text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">צבע עיקרי</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingData.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingData.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text"
                  placeholder="#38BDF8"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">צבע משני</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingData.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingData.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text"
                  placeholder="#0EA5E9"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">צבע דגש</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingData.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingData.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text"
                  placeholder="#FACC15"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">צבע רקע</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingData.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingData.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text"
                  placeholder="#0F172A"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">צבע טקסט</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingData.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingData.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text"
                  placeholder="#F1F5F9"
                />
              </div>
            </div>

            {/* Custom Font */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">גופן מותאם</label>
              <select
                value={brandingData.customFont}
                onChange={(e) => handleColorChange('customFont', e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logo Tab */}
      {activeTab === 'logo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Brand Logo */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text">לוגו המספרה</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {brandingData.brandLogo ? (
                    <div className="space-y-4">
                      <img 
                        src={brandingData.brandLogo} 
                        alt="Brand Logo" 
                        className="max-h-32 mx-auto rounded"
                      />
                      <button
                        onClick={() => setBrandingData(prev => ({ ...prev, brandLogo: '' }))}
                        className="text-error hover:text-error-dark text-sm"
                      >
                        הסר לוגו
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted" />
                      <p className="text-muted">העלה לוגו למספרה</p>
                      <p className="text-xs text-muted">PNG, JPG עד 2MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload('brandLogo', file)
                  }}
                  className="hidden"
                  id="brand-logo-upload"
                />
                <label
                  htmlFor="brand-logo-upload"
                  className="px-4 py-2 bg-primary text-onPrimary rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-center"
                >
                  <Upload className="w-4 h-4 ml-2 rtl:mr-2" />
                  העלה לוגו
                </label>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text">Favicon</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {brandingData.favicon ? (
                    <div className="space-y-4">
                      <img 
                        src={brandingData.favicon} 
                        alt="Favicon" 
                        className="w-16 h-16 mx-auto rounded"
                      />
                      <button
                        onClick={() => setBrandingData(prev => ({ ...prev, favicon: '' }))}
                        className="text-error hover:text-error-dark text-sm"
                      >
                        הסר Favicon
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Globe className="w-8 h-8 mx-auto text-muted" />
                      <p className="text-muted">העלה Favicon</p>
                      <p className="text-xs text-muted">ICO, PNG עד 32x32px</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload('favicon', file)
                  }}
                  className="hidden"
                  id="favicon-upload"
                />
                <label
                  htmlFor="favicon-upload"
                  className="px-4 py-2 bg-primary text-onPrimary rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-center"
                >
                  <Upload className="w-4 h-4 ml-2 rtl:mr-2" />
                  העלה Favicon
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text">כותרת SEO</label>
            <input
              type="text"
              value={brandingData.metaTitle}
              onChange={(e) => handleColorChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text"
              placeholder="מספרת דוד - תספורת מקצועית לגברים"
            />
            <p className="text-xs text-muted">כותרת שתופיע בתוצאות החיפוש (עד 60 תווים)</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-text">תיאור SEO</label>
            <textarea
              value={brandingData.metaDescription}
              onChange={(e) => handleColorChange('metaDescription', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text h-24 resize-none"
              placeholder="מספרה מקצועית לגברים עם שירותים מתקדמים וצוות מנוסה. אנו מתמחים בתספורות קלאסיות ומודרניות..."
            />
            <p className="text-xs text-muted">תיאור שתופיע בתוצאות החיפוש (עד 160 תווים)</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default BrandingSettings
