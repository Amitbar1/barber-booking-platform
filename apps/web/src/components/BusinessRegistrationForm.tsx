import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface BusinessRegistrationFormProps {
  onClose: () => void
  onSuccess?: (businessData: any) => void
}

interface BusinessFormData {
  businessName: string
  ownerName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  address: string
  city: string
  description: string
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  services: string[]
  priceRange: string
  acceptTerms: boolean
  acceptMarketing: boolean
}

const BusinessRegistrationForm = ({ onClose, onSuccess }: BusinessRegistrationFormProps) => {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    description: '',
    workingHours: {
      'ראשון': { open: '09:00', close: '18:00', closed: false },
      'שני': { open: '09:00', close: '18:00', closed: false },
      'שלישי': { open: '09:00', close: '18:00', closed: false },
      'רביעי': { open: '09:00', close: '18:00', closed: false },
      'חמישי': { open: '09:00', close: '18:00', closed: false },
      'שישי': { open: '09:00', close: '14:00', closed: false },
      'שבת': { open: '00:00', close: '00:00', closed: true }
    },
    services: [],
    priceRange: '₪50-100',
    acceptTerms: false,
    acceptMarketing: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const totalSteps = 4
  const availableServices = ['תספורת', 'זקן', 'חבילה', 'טיפוח', 'שטיפת שיער', 'צביעת שיער', 'עיצוב זקן']
  const priceRanges = ['₪30-60', '₪50-100', '₪80-150', '₪100-200', '₪150+']

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) newErrors.businessName = 'שם העסק נדרש'
        if (!formData.ownerName.trim()) newErrors.ownerName = 'שם הבעלים נדרש'
        if (!formData.phone.trim()) newErrors.phone = 'מספר טלפון נדרש'
        else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phone)) newErrors.phone = 'מספר טלפון לא תקין'
        if (!formData.email.trim()) newErrors.email = 'כתובת אימייל נדרשת'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה'
        break

      case 2:
        if (!formData.password) newErrors.password = 'סיסמה נדרשת'
        else if (formData.password.length < 6) newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים'
        if (!formData.confirmPassword) newErrors.confirmPassword = 'אישור סיסמה נדרש'
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'סיסמאות לא תואמות'
        break

      case 3:
        if (!formData.address.trim()) newErrors.address = 'כתובת נדרשת'
        if (!formData.city.trim()) newErrors.city = 'עיר נדרשת'
        if (!formData.description.trim()) newErrors.description = 'תיאור העסק נדרש'
        else if (formData.description.length < 20) newErrors.description = 'תיאור חייב להכיל לפחות 20 תווים'
        break

      case 4:
        if (formData.services.length === 0) newErrors.services = 'יש לבחור לפחות שירות אחד'
        if (!formData.acceptTerms) newErrors.acceptTerms = 'יש לאשר את התנאים וההגבלות'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field: keyof BusinessFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle service toggle
  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }


  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  // Previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      onSuccess?.(formData)
      onClose()
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text mb-6">פרטי העסק והבעלים</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">שם העסק *</label>
                <div className="relative">
                  <Building className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.businessName ? 'border-error' : 'border-border'
                    }`}
                    placeholder="שם המספרה"
                  />
                </div>
                {errors.businessName && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">שם הבעלים *</label>
                <div className="relative">
                  <User className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.ownerName ? 'border-error' : 'border-border'
                    }`}
                    placeholder="שם מלא"
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.ownerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">טלפון *</label>
                <div className="relative">
                  <Phone className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.phone ? 'border-error' : 'border-border'
                    }`}
                    placeholder="03-1234567"
                  />
                </div>
                {errors.phone && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">אימייל *</label>
                <div className="relative">
                  <Mail className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.email ? 'border-error' : 'border-border'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text mb-6">הגדרת סיסמה</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">סיסמה *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-4 pr-12 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.password ? 'border-error' : 'border-border'
                    }`}
                    placeholder="לפחות 6 תווים"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">אישור סיסמה *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-4 pr-12 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.confirmPassword ? 'border-error' : 'border-border'
                    }`}
                    placeholder="הזן שוב את הסיסמה"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text mb-6">פרטי המיקום והעסק</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">כתובת *</label>
                <div className="relative">
                  <MapPin className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.address ? 'border-error' : 'border-border'
                    }`}
                    placeholder="רחוב ומספר בית"
                  />
                </div>
                {errors.address && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">עיר *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.city ? 'border-error' : 'border-border'
                  }`}
                  placeholder="תל אביב"
                />
                {errors.city && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">תיאור העסק *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-surface border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                    errors.description ? 'border-error' : 'border-border'
                  }`}
                  placeholder="תאר את המספרה, השירותים, הניסיון..."
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-muted mt-1">{formData.description.length}/20 תווים</p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text mb-6">שירותים ותנאים</h3>
            
            <div>
              <label className="block text-sm font-medium text-text mb-3">שירותים *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.services.includes(service)
                        ? 'bg-primary text-onPrimary'
                        : 'bg-surface border border-border text-text hover:bg-surface-hover'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
              {errors.services && (
                <p className="text-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                  {errors.services}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-3">טווח מחירים</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleInputChange('priceRange', range)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.priceRange === range
                        ? 'bg-primary text-onPrimary'
                        : 'bg-surface border border-border text-text hover:bg-surface-hover'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/50"
                />
                <label htmlFor="acceptTerms" className="text-sm text-text">
                  אני מסכים ל
                  <a href="#" className="text-primary hover:underline mr-1 rtl:ml-1">תנאים והגבלות</a>
                  ו
                  <a href="#" className="text-primary hover:underline mr-1 rtl:ml-1">מדיניות פרטיות</a>
                  *
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-error text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                  {errors.acceptTerms}
                </p>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/50"
                />
                <label htmlFor="acceptMarketing" className="text-sm text-text">
                  אני מעוניין לקבל עדכונים וחדשות על השירות
                </label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text">פתח מספרה חדשה</h2>
            <p className="text-sm text-muted mt-1">שלב {currentStep} מתוך {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-surface-hover rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-border text-text rounded-xl hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            קודם
          </button>

          <div className="flex items-center gap-3">
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-onPrimary rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    שלח בקשה
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-primary text-onPrimary rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                הבא
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BusinessRegistrationForm
