import { forwardRef, useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[]
  onChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'free'
  showPreview?: boolean
  dragAndDrop?: boolean
}

const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ 
    className,
    value = [],
    onChange,
    accept = 'image/*',
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    disabled = false,
    error,
    label,
    helperText,
    aspectRatio = 'free',
    showPreview = true,
    dragAndDrop = true,
    ...props 
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [files, setFiles] = useState<File[]>(value)
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const aspectRatios = {
      square: 'aspect-square',
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '3:2': 'aspect-[3/2]',
      free: ''
    }

    const handleFileSelect = (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles = Array.from(selectedFiles)
      const validFiles = newFiles.filter(file => {
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          alert(`הקובץ ${file.name} אינו תמונה`)
          return false
        }
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`הקובץ ${file.name} גדול מדי. הגודל המקסימלי הוא ${maxSize}MB`)
          return false
        }
        return true
      })

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
      const limitedFiles = updatedFiles.slice(0, maxFiles)
      
      setFiles(limitedFiles)
      onChange?.(limitedFiles)

      // Generate previews
      if (showPreview) {
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews)
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      
      if (disabled) return
      
      const droppedFiles = e.dataTransfer.files
      handleFileSelect(droppedFiles)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files)
    }

    const handleRemoveFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      const updatedPreviews = previews.filter((_, i) => i !== index)
      
      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      onChange?.(updatedFiles)
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-primary-200 mb-2">
            {label}
          </label>
        )}
        
        <div
          className={clsx(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            'bg-primary-800 border-primary-600',
            isDragOver && 'border-accent-500 bg-accent-500/10',
            error && 'border-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
          />
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-700 rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            
            <p className="text-lg font-medium text-primary-100 mb-2">
              {dragAndDrop ? 'גרור תמונות לכאן או' : ''} לחץ לבחירת תמונות
            </p>
            
            <p className="text-sm text-primary-400 mb-4">
              עד {maxFiles} תמונות, כל תמונה עד {maxSize}MB
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="btn-primary"
            >
              <Upload className="w-4 h-4 ml-2 rtl:mr-2" />
              בחר תמונות
            </button>
          </div>
        </div>

        {/* Image previews */}
        {showPreview && previews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <motion.div
                key={`${files[index].name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={clsx(
                  'relative group rounded-lg overflow-hidden bg-primary-700',
                  aspectRatios[aspectRatio]
                )}
              >
                <img
                  src={preview}
                  alt={files[index].name}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-white hover:text-red-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 p-2">
                  <p className="text-xs text-white truncate">
                    {files[index].name}
                  </p>
                  <p className="text-xs text-gray-300">
                    {formatFileSize(files[index].size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
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

ImageUpload.displayName = 'ImageUpload'

export default ImageUpload
