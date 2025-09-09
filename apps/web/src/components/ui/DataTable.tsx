import { forwardRef, useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table'
import { Input } from './Input'
import { Button } from './Button'
import { Select } from './Select'
import { Pagination } from './Pagination'

interface Column<T> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  searchable?: boolean
  sortable?: boolean
  filterable?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  loading?: boolean
  emptyMessage?: string
  title?: string
  description?: string
}

const DataTable = forwardRef<HTMLDivElement, DataTableProps<any>>(
  ({ 
    className,
    data,
    columns,
    pageSize = 10,
    searchable = true,
    sortable = true,
    filterable = true,
    selectable = false,
    onRowClick,
    onSelectionChange,
    loading = false,
    emptyMessage = 'אין נתונים להצגה',
    title,
    description,
    ...props 
  }, ref) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<keyof any>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<any[]>([])

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
    }, [data, searchTerm, sortColumn, sortDirection])

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * pageSize
      return filteredData.slice(startIndex, startIndex + pageSize)
    }, [filteredData, currentPage, pageSize])

    const totalPages = Math.ceil(filteredData.length / pageSize)

    const handleSort = (column: keyof any) => {
      if (!sortable) return
      
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

        {/* Table */}
        <div className="bg-primary-800 rounded-lg border border-primary-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate()
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                    />
                  </TableHead>
                )}
                
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={clsx(
                      sortable && 'cursor-pointer hover:bg-primary-700/50',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    onClick={() => handleSort(column.key)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span>{column.title}</span>
                      {sortable && sortColumn === column.key && (
                        <div className="text-accent-500">
                          {sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                
                <TableHead className="w-12">
                  <MoreHorizontal className="w-4 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell>
                        <div className="w-4 h-4 bg-primary-700 rounded animate-pulse" />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        <div className="h-4 bg-primary-700 rounded animate-pulse" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="w-4 h-4 bg-primary-700 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={clsx(
                      onRowClick && 'cursor-pointer hover:bg-primary-700/50',
                      isRowSelected(row) && 'bg-accent-500/10'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isRowSelected(row)}
                          onChange={(e) => handleSelectRow(row, e.target.checked)}
                          className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={clsx(
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </TableCell>
                    ))}
                    
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 2 : 1)} className="text-center py-8">
                    <div className="text-primary-400">
                      {emptyMessage}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

DataTable.displayName = 'DataTable'

export default DataTable
