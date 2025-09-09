import { forwardRef } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    className,
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    ...props 
  }, ref) => {
    const getVisiblePages = () => {
      const pages: (number | string)[] = []
      const half = Math.floor(maxVisiblePages / 2)
      
      let start = Math.max(1, currentPage - half)
      let end = Math.min(totalPages, currentPage + half)
      
      if (end - start + 1 < maxVisiblePages) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisiblePages - 1)
        } else {
          start = Math.max(1, end - maxVisiblePages + 1)
        }
      }
      
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
      
      return pages
    }

    const visiblePages = getVisiblePages()

    return (
      <div
        ref={ref}
        className={clsx('flex items-center justify-center space-x-1 rtl:space-x-reverse', className)}
        {...props}
      >
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-primary-400 hover:text-primary-100 hover:bg-primary-700 transition-colors"
          >
            <span className="sr-only">First page</span>
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-1 rtl:ml-1" />
          </button>
        )}
        
        {showPrevNext && currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-primary-400 hover:text-primary-100 hover:bg-primary-700 transition-colors"
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={clsx(
              'flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors',
              typeof page === 'number'
                ? page === currentPage
                  ? 'bg-accent-500 text-primary-900'
                  : 'text-primary-400 hover:text-primary-100 hover:bg-primary-700'
                : 'text-primary-500 cursor-default'
            )}
          >
            {typeof page === 'number' ? page : <MoreHorizontal className="w-4 h-4" />}
          </button>
        ))}
        
        {showPrevNext && currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-primary-400 hover:text-primary-100 hover:bg-primary-700 transition-colors"
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-primary-400 hover:text-primary-100 hover:bg-primary-700 transition-colors"
          >
            <span className="sr-only">Last page</span>
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-1 rtl:ml-1" />
          </button>
        )}
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export default Pagination
