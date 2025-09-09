import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Phone, Clock, AlertCircle } from 'lucide-react'

interface SendOtpProps {
  customerName: string
  customerPhone: string
  holdId: string
  onOtpSent: () => void
  onBack: () => void
}

const SendOtp = ({ customerName, customerPhone, holdId, onOtpSent, onBack }: SendOtpProps) => {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [retryAfter, setRetryAfter] = useState(0)

  // Normalize phone number for display
  const formatPhoneForDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('0')) {
      return `+972-${digits.substring(1).replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')}`
    }
    return phone
  }

  // Send OTP
  const handleSendOtp = async () => {
    if (retryAfter > 0) return

    setIsSending(true)
    setError('')

    try {
      const response = await fetch('/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: customerPhone })
      })

      const data = await response.json()

      if (data.success) {
        onOtpSent()
      } else {
        setError(data.message || 'שגיאה בשליחת קוד האימות')
        if (data.retryAfter) {
          setRetryAfter(data.retryAfter)
          const timer = setInterval(() => {
            setRetryAfter(prev => {
              if (prev <= 1) {
                clearInterval(timer)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      setError('שגיאה בחיבור לשרת. נא לנסות שוב')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-onSurface mb-2">
            שליחת קוד אימות
          </h2>
          <p className="text-onSurface/70 text-sm">
            נשלח קוד אימות למספר הטלפון שלך
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-surface/50 rounded-xl p-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {customerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-onSurface">{customerName}</p>
                <p className="text-sm text-onSurface/70">
                  {formatPhoneForDisplay(customerPhone)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-info font-medium mb-1">מה יקרה עכשיו?</p>
              <ul className="text-info/80 space-y-1">
                <li>• נשלח לך SMS עם קוד אימות של 6 ספרות</li>
                <li>• הקוד תקף ל-5 דקות</li>
                <li>• לאחר האימות, התור יאושר אוטומטית</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSendOtp}
            disabled={isSending || retryAfter > 0}
            className="w-full bg-primary text-onPrimary rounded-xl py-3 px-4 font-semibold hover:opacity-90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-onPrimary border-t-transparent rounded-full animate-spin" />
                שולח קוד...
              </>
            ) : retryAfter > 0 ? (
              <>
                <Clock className="w-5 h-5" />
                נסה שוב בעוד {retryAfter} שניות
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                שלח קוד אימות
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full bg-surface border border-outline text-onSurface rounded-xl py-3 px-4 font-semibold hover:bg-surface/80 focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזור לפרטי הלקוח
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-onSurface/60">
            לא קיבלת את הקוד? בדוק את תיקיית הספאם או נסה שוב
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default SendOtp
