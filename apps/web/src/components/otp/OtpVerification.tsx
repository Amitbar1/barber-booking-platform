import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, ArrowRight, ArrowLeft, Clock, Phone } from 'lucide-react'

interface OtpVerificationProps {
  phone: string
  customerName: string
  holdId: string
  onSuccess: (manageUrl: string) => void
  onBack: () => void
  onResend: () => void
}

const OtpVerification = ({ 
  phone, 
  customerName, 
  holdId, 
  onSuccess, 
  onBack, 
  onResend 
}: OtpVerificationProps) => {
  const [otpCode, setOtpCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [retryAfter, setRetryAfter] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = otpCode.split('')
    newOtp[index] = value
    const updatedOtp = newOtp.join('')
    setOtpCode(updatedOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    setOtpCode(pastedData)
    setError('')
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError('נא להזין קוד אימות מלא')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code: otpCode,
          holdId,
          customerName
        })
      })

      const data = await response.json()

      if (data.success) {
        onSuccess(data.manageUrl)
      } else {
        setError(data.message || 'שגיאה באימות הקוד')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('שגיאה בחיבור לשרת. נא לנסות שוב')
    } finally {
      setIsVerifying(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (retryAfter > 0) return

    setIsResending(true)
    setError('')

    try {
      const response = await fetch('/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (data.success) {
        setTimeLeft(300) // Reset timer
        setOtpCode('') // Clear current code
        setError('')
        onResend()
      } else {
        setError(data.message || 'שגיאה בשליחת הקוד')
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
      console.error('Resend OTP error:', error)
      setError('שגיאה בחיבור לשרת. נא לנסות שוב')
    } finally {
      setIsResending(false)
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
            אימות מספר טלפון
          </h2>
          <p className="text-onSurface/70 text-sm">
            שלחנו קוד אימות למספר
            <br />
            <span className="font-semibold text-primary">{phone}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-onSurface/80 mb-3 text-center">
            הזן את קוד האימות (6 ספרות)
          </label>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otpCode[index] || ''}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-outline rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                disabled={isVerifying}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-onSurface/70">
            <Clock className="w-4 h-4" />
            <span>
              {timeLeft > 0 ? `נותרו ${formatTime(timeLeft)}` : 'הקוד פג תוקף'}
            </span>
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
            onClick={handleVerifyOtp}
            disabled={otpCode.length !== 6 || isVerifying || timeLeft === 0}
            className="w-full bg-primary text-onPrimary rounded-xl py-3 px-4 font-semibold hover:opacity-90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-onPrimary border-t-transparent rounded-full animate-spin" />
                מאמת...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                אשר קוד
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 bg-surface border border-outline text-onSurface rounded-xl py-3 px-4 font-semibold hover:bg-surface/80 focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזור
            </button>

            <button
              onClick={handleResendOtp}
              disabled={isResending || retryAfter > 0 || timeLeft > 240} // Can resend after 1 minute
              className="flex-1 bg-secondary text-onSecondary rounded-xl py-3 px-4 font-semibold hover:opacity-90 focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-onSecondary border-t-transparent rounded-full animate-spin" />
                  שולח...
                </>
              ) : retryAfter > 0 ? (
                `שלח שוב (${retryAfter}s)`
              ) : (
                'שלח קוד חדש'
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-onSurface/60">
            לא קיבלת את הקוד? בדוק את תיקיית הספאם או
            <button
              onClick={handleResendOtp}
              disabled={isResending || retryAfter > 0}
              className="text-primary hover:underline disabled:opacity-50"
            >
              שלח שוב
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default OtpVerification
