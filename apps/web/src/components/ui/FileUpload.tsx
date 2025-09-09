import { forwardRef, useState, useRef } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
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
  preview?: boolean
  dragAndDrop?: boolean
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    className,
    value = [],
    onChange,
    accept,
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    disabled = false,
    error,
    label,
    helperText,
    preview = true,
    dragAndDrop = true,
    ...props 
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [files, setFiles] = useState<File[]>(value)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles = Array.from(selectedFiles)
      const validFiles = newFiles.filter(file => {
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
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    }

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <Image className="w-5 h-5" />
      } else if (file.type.startsWith('text/')) {
        return <FileText className="w-5 h-5" />
      } else {
        return <File className="w-5 h-5" />
      }
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
            <Upload className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            
            <p className="text-lg font-medium text-primary-100 mb-2">
              {dragAndDrop ? 'גרור קבצים לכאן או' : ''} לחץ לבחירת קבצים
            </p>
            
            <p className="text-sm text-primary-400 mb-4">
              עד {maxFiles} קבצים, כל קובץ עד {maxSize}MB
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="btn-primary"
            >
              בחר קבצים
            </button>
          </div>
        </div>

        {/* File previews */}
        {preview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-primary-700 rounded-lg"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-primary-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-primary-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-primary-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
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

FileUpload.displayName = 'FileUpload'

export default FileUpload
