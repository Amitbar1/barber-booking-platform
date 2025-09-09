import { forwardRef, useState, useMemo } from 'react'
import { Search, Filter, MoreHorizontal, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Input } from './Input'
import { Button } from './Button'
import { Pagination } from './Pagination'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

interface DataListProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  columns: {
    key: keyof T
    title: string
    render?: (value: any, row: T) => React.ReactNode
    width?: string
    sortable?: boolean
  }[]
  pageSize?: number
  searchable?: boolean
  filterable?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  loading?: boolean
  emptyMessage?: string
  title?: string
  description?: string
  showHeader?: boolean
  showFooter?: boolean
  expandable?: boolean
  expandedContent?: (row: T) => React.ReactNode
}

const DataList = forwardRef<HTMLDivElement, DataListProps<any>>(
  ({ 
    className,
    data,
    columns,
    pageSize = 10,
    searchable = true,
    filterable = true,
    selectable = false,
    onRowClick,
    onSelectionChange,
    loading = false,
    emptyMessage = 'אין נתונים להצגה',
    title,
    description,
    showHeader = true,
    showFooter = true,
    expandable = false,
    expandedContent,
    ...props 
  }, ref) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof any>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const filteredData = useMemo(() => {
      let filtered = data

      // Search
      if (searchTerm) {
        filtered = filtered.filter(row =>
          columns.some(column => {
            const value = row[column.key]
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          })
        )
      }

      // Sort
      if (sortColumn) {
        filtered = [...filtered].sort((a, b) => {
          const aValue = a[sortColumn]
          const bValue = b[sortColumn]
          
          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }

      return filtered
    }, [data, searchTerm, columns, sortColumn, sortDirection])

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * pageSize
      return filteredData.slice(startIndex, startIndex + pageSize)
    }, [filteredData, currentPage, pageSize])

    const totalPages = Math.ceil(filteredData.length / pageSize)

    const handleSort = (column: keyof any) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortColumn(column)
        setSortDirection('asc')
      }
    }

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows(paginatedData)
        onSelectionChange?.(paginatedData)
      } else {
        setSelectedRows([])
        onSelectionChange?.([])
      }
    }

    const handleSelectRow = (row: any, checked: boolean) => {
      let newSelection
      if (checked) {
        newSelection = [...selectedRows, row]
      } else {
        newSelection = selectedRows.filter(r => r !== row)
      }
      setSelectedRows(newSelection)
      onSelectionChange?.(newSelection)
    }

    const handleToggleExpanded = (index: number) => {
      const newExpanded = new Set(expandedRows)
      if (newExpanded.has(index)) {
        newExpanded.delete(index)
      } else {
        newExpanded.add(index)
      }
      setExpandedRows(newExpanded)
    }

    const isRowSelected = (row: any) => {
      return selectedRows.includes(row)
    }

    const isAllSelected = () => {
      return paginatedData.length > 0 && selectedRows.length === paginatedData.length
    }

    const isIndeterminate = () => {
      return selectedRows.length > 0 && selectedRows.length < paginatedData.length
    }

    return (
      <div className={clsx('w-full', className)} ref={ref} {...props}>
        {/* Header */}
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-2xl font-bold text-primary-100 mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-primary-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {searchable && (
            <div className="flex-1">
              <Input
                placeholder="חיפוש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
              סינון
            </Button>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-4 h-4 bg-primary-700 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-primary-700 rounded" />
                      <div className="h-3 bg-primary-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={clsx(
                    'cursor-pointer hover:border-accent-500/50 transition-all duration-200',
                    isRowSelected(row) && 'border-accent-500 bg-accent-500/10'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        {selectable && (
                          <input
                            type="checkbox"
                            checked={isRowSelected(row)}
                            onChange={(e) => handleSelectRow(row, e.target.checked)}
                            className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {columns.map((column) => (
                              <div key={String(column.key)} className="text-sm">
                                <span className="text-primary-400">{column.title}:</span>
                                <span className="text-primary-100 mr-2 rtl:ml-2">
                                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {expandable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleExpanded(index)
                            }}
                          >
                            <ChevronRight
                              className={clsx(
                                'w-4 h-4 transition-transform duration-200',
                                expandedRows.has(index) && 'rotate-90'
                              )}
                            />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded content */}
                    {expandable && expandedRows.has(index) && expandedContent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-primary-700"
                      >
                        {expandedContent(row)}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-primary-400 text-lg">
                {emptyMessage}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    )
  }
)

DataList.displayName = 'DataList'

export default DataList
