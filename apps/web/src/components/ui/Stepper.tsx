import { forwardRef } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string
    title: string
    description?: string
    icon?: React.ReactNode
  }[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
  clickable?: boolean
}

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ 
    className,
    steps,
    currentStep,
    onStepClick,
    orientation = 'horizontal',
    size = 'md',
    color = 'accent',
    clickable = false,
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    const colors = {
      primary: 'text-primary-500',
      accent: 'text-accent-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    }

    const getStepStatus = (stepIndex: number) => {
      if (stepIndex < currentStep) return 'completed'
      if (stepIndex === currentStep) return 'current'
      return 'upcoming'
    }

    const getStepClasses = (stepIndex: number) => {
      const status = getStepStatus(stepIndex)
      
      return {
        container: clsx(
          'flex items-center',
          orientation === 'vertical' && 'flex-col text-center',
          clickable && 'cursor-pointer'
        ),
        circle: clsx(
          'flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-200',
          status === 'completed' && 'bg-accent-500 border-accent-500 text-primary-900',
          status === 'current' && 'border-accent-500 text-accent-500',
          status === 'upcoming' && 'border-primary-600 text-primary-400',
          size === 'sm' && 'w-8 h-8 text-xs',
          size === 'md' && 'w-10 h-10 text-sm',
          size === 'lg' && 'w-12 h-12 text-base'
        ),
        line: clsx(
          'bg-primary-600 transition-colors duration-200',
          stepIndex < currentStep && 'bg-accent-500',
          orientation === 'horizontal' ? 'h-0.5 flex-1' : 'w-0.5 h-8'
        ),
        content: clsx(
          'flex flex-col',
          orientation === 'horizontal' ? 'ml-4 rtl:mr-4' : 'mt-2'
        ),
        title: clsx(
          'font-medium transition-colors duration-200',
          status === 'completed' && 'text-primary-100',
          status === 'current' && 'text-accent-500',
          status === 'upcoming' && 'text-primary-400',
          sizes[size]
        ),
        description: clsx(
          'text-sm transition-colors duration-200',
          status === 'completed' && 'text-primary-300',
          status === 'current' && 'text-primary-300',
          status === 'upcoming' && 'text-primary-500'
        )
      }
    }

    const handleStepClick = (stepIndex: number) => {
      if (clickable && onStepClick) {
        onStepClick(stepIndex)
      }
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'w-full',
          orientation === 'horizontal' ? 'flex items-center' : 'space-y-4',
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const classes = getStepClasses(index)
          const status = getStepStatus(index)

          return (
            <div key={step.id} className="flex items-center">
              <div className={classes.container}>
                {/* Step circle */}
                <motion.div
                  className={classes.circle}
                  onClick={() => handleStepClick(index)}
                  whileHover={clickable ? { scale: 1.05 } : {}}
                  whileTap={clickable ? { scale: 0.95 } : {}}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Step content */}
                <div className={classes.content}>
                  <div className={classes.title}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className={classes.description}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className={clsx(
                  'mx-4',
                  orientation === 'vertical' && 'mx-0 my-2'
                )}>
                  <div className={classes.line} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'

export default Stepper
