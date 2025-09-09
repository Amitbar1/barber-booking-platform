import { forwardRef, useState } from 'react'
import { Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onChange?: (color: string) => void
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  presetColors?: string[]
  showPresets?: boolean
  showInput?: boolean
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ 
    className,
    value = '#000000',
    onChange,
    disabled = false,
    error,
    label,
    helperText,
    presetColors = [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
      '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
      '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
    ],
    showPresets = true,
    showInput = true,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState(value)

    const handleColorChange = (color: string) => {
      setSelectedColor(color)
      onChange?.(color)
    }

    const handlePresetClick = (color: string) => {
      handleColorChange(color)
      setIsOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleColorChange(e.target.value)
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-primary-200 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200',
              'bg-primary-700 border-primary-600 text-primary-100',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
              'hover:border-accent-500/50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div
                className="w-6 h-6 rounded border border-primary-600"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-primary-100">
                {selectedColor}
              </span>
            </div>
            
            <Palette className="w-4 h-4 text-primary-400" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 rtl:right-0 mt-2 z-50 w-full bg-primary-800 rounded-lg border border-primary-700 shadow-xl p-4"
              >
                {/* Color input */}
                {showInput && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-primary-200 mb-2">
                      קוד צבע
                    </label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded border border-primary-600 bg-primary-700 cursor-pointer"
                    />
                  </div>
                )}

                {/* Preset colors */}
                {showPresets && (
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-2">
                      צבעים מוכנים
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handlePresetClick(color)}
                          className={clsx(
                            'w-8 h-8 rounded border-2 transition-all duration-200',
                            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-500',
                            selectedColor === color
                              ? 'border-accent-500 ring-2 ring-accent-500/50'
                              : 'border-primary-600 hover:border-primary-500'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom color input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-primary-200 mb-2">
                    קוד צבע מותאם
                  </label>
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    className="w-full px-3 py-2 rounded border border-primary-600 bg-primary-700 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-primary-400">{helperText}</p>
        )}
      </div>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'

export default ColorPicker
