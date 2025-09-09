import { forwardRef, useState, useMemo } from 'react'
import { Search, Filter, Grid, List, Table, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Input } from './Input'
import { Button } from './Button'
import { Pagination } from './Pagination'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table'

interface DataViewProps<T> extends React.HTMLAttributes<HTMLDivElement> {
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
  viewModes?: ('grid' | 'list' | 'table')[]
  defaultView?: 'grid' | 'list' | 'table'
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  loading?: boolean
  emptyMessage?: string
  title?: string
  description?: string
  gridItemComponent?: (row: T, index: number) => React.ReactNode
  listItemComponent?: (row: T, index: number) => React.ReactNode
  tableItemComponent?: (row: T, index: number) => React.ReactNode
}

const DataView = forwardRef<HTMLDivElement, DataViewProps<any>>(
  ({ 
    className,
    data,
    columns,
    pageSize = 12,
    searchable = true,
    filterable = true,
    selectable = false,
    viewModes = ['grid', 'list', 'table'],
    defaultView = 'grid',
    onRowClick,
    onSelectionChange,
    loading = false,
    emptyMessage = 'אין נתונים להצגה',
    title,
    description,
    gridItemComponent,
    listItemComponent,
    tableItemComponent,
    ...props 
  }, ref) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [view, setView] = useState<'grid' | 'list' | 'table'>(defaultView)
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

    const isRowSelected = (row: any) => {
      return selectedRows.includes(row)
    }

    const isAllSelected = () => {
      return paginatedData.length > 0 && selectedRows.length === paginatedData.length
    }

    const isIndeterminate = () => {
      return selectedRows.length > 0 && selectedRows.length < paginatedData.length
    }

    const renderGridView = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedData.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {gridItemComponent ? (
              gridItemComponent(row, index)
            ) : (
              <Card
                className={clsx(
                  'cursor-pointer hover:border-accent-500/50 transition-all duration-200',
                  isRowSelected(row) && 'border-accent-500 bg-accent-500/10'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <div className="absolute top-2 right-2 rtl:left-2">
                    <input
                      type="checkbox"
                      checked={isRowSelected(row)}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg">
                    {row[columns[0]?.key] || `Item ${index + 1}`}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {columns.slice(1).map((column) => (
                      <div key={String(column.key)} className="text-sm">
                        <span className="text-primary-400">{column.title}:</span>
                        <span className="text-primary-100 mr-2 rtl:ml-2">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    )

    const renderListView = () => (
      <div className="space-y-4">
        {paginatedData.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {listItemComponent ? (
              listItemComponent(row, index)
            ) : (
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
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    )

    const renderTableView = () => (
      <div className="bg-primary-800 rounded-lg border border-primary-700 overflow-hidden">
        <TableComponent>
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
                    column.sortable && 'cursor-pointer hover:bg-primary-700/50'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>{column.title}</span>
                    {column.sortable && sortColumn === column.key && (
                      <div className="text-accent-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
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
            {paginatedData.map((row, index) => (
              <TableRow
                key={index}
                className={clsx(
                  'cursor-pointer hover:bg-primary-700/50',
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
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>
    )

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
          
          {viewModes.length > 1 && (
            <div className="flex space-x-2 rtl:space-x-reverse">
              {viewModes.includes('grid') && (
                <Button
                  variant={view === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setView('grid')}
                  icon={<Grid className="w-4 h-4" />}
                />
              )}
              {viewModes.includes('list') && (
                <Button
                  variant={view === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                  icon={<List className="w-4 h-4" />}
                />
              )}
              {viewModes.includes('table') && (
                <Button
                  variant={view === 'table' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setView('table')}
                  icon={<Table className="w-4 h-4" />}
                />
              )}
            </div>
          )}
        </div>

        {/* Select all */}
        {selectable && paginatedData.length > 0 && (
          <div className="mb-4">
            <label className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                checked={isAllSelected()}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate()
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-accent-500 bg-primary-700 border-primary-600 rounded focus:ring-accent-500"
              />
              <span className="text-sm text-primary-300">
                בחר הכל ({selectedRows.length} נבחרו)
              </span>
            </label>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-primary-700 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary-700 rounded" />
                    <div className="h-3 bg-primary-700 rounded" />
                    <div className="h-3 bg-primary-700 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedData.length > 0 ? (
          view === 'grid' ? renderGridView() :
          view === 'list' ? renderListView() :
          renderTableView()
        ) : (
          <div className="text-center py-12">
            <div className="text-primary-400 text-lg">
              {emptyMessage}
            </div>
          </div>
        )}

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

DataView.displayName = 'DataView'

export default DataView