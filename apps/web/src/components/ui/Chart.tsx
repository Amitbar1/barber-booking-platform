import { forwardRef, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    label: string
    value: number
    color?: string
  }[]
  type?: 'bar' | 'line' | 'pie' | 'doughnut'
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
  showValues?: boolean
  animated?: boolean
  title?: string
  description?: string
}

const Chart = forwardRef<HTMLDivElement, ChartProps>(
  ({ 
    className,
    data,
    type = 'bar',
    size = 'md',
    showLegend = true,
    showValues = false,
    animated = true,
    title,
    description,
    ...props 
  }, ref) => {
    const chartRef = useRef<HTMLCanvasElement>(null)
    const maxValue = Math.max(...data.map(item => item.value))

    const sizes = {
      sm: 'h-48',
      md: 'h-64',
      lg: 'h-80'
    }

    const colors = [
      '#facc15', '#ef4444', '#22c55e', '#3b82f6', '#a855f7',
      '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
    ]

    const getItemColor = (item: any, index: number) => {
      return item.color || colors[index % colors.length]
    }

    const renderBarChart = () => {
      if (!chartRef.current) return

      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      const barWidth = width / data.length
      const maxBarHeight = height * 0.8

      ctx.clearRect(0, 0, width, height)

      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * maxBarHeight
        const x = index * barWidth
        const y = height - barHeight

        ctx.fillStyle = getItemColor(item, index)
        ctx.fillRect(x + 10, y, barWidth - 20, barHeight)

        if (showValues) {
          ctx.fillStyle = '#f8fafc'
          ctx.font = '12px Inter'
          ctx.textAlign = 'center'
          ctx.fillText(
            item.value.toString(),
            x + barWidth / 2,
            y - 5
          )
        }
      })
    }

    const renderLineChart = () => {
      if (!chartRef.current) return

      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      const stepX = width / (data.length - 1)
      const maxBarHeight = height * 0.8

      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = getItemColor(data[0], 0)
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((item, index) => {
        const x = index * stepX
        const y = height - (item.value / maxValue) * maxBarHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      data.forEach((item, index) => {
        const x = index * stepX
        const y = height - (item.value / maxValue) * maxBarHeight

        ctx.fillStyle = getItemColor(item, index)
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    const renderPieChart = () => {
      if (!chartRef.current) return

      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 20

      const total = data.reduce((sum, item) => sum + item.value, 0)
      let currentAngle = 0

      ctx.clearRect(0, 0, width, height)

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI

        ctx.fillStyle = getItemColor(item, index)
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
        ctx.closePath()
        ctx.fill()

        currentAngle += sliceAngle
      })
    }

    const renderDoughnutChart = () => {
      if (!chartRef.current) return

      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const outerRadius = Math.min(width, height) / 2 - 20
      const innerRadius = outerRadius * 0.6

      const total = data.reduce((sum, item) => sum + item.value, 0)
      let currentAngle = 0

      ctx.clearRect(0, 0, width, height)

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI

        ctx.fillStyle = getItemColor(item, index)
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle)
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
        ctx.closePath()
        ctx.fill()

        currentAngle += sliceAngle
      })
    }

    useEffect(() => {
      if (!chartRef.current) return

      const canvas = chartRef.current
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      switch (type) {
        case 'bar':
          renderBarChart()
          break
        case 'line':
          renderLineChart()
          break
        case 'pie':
          renderPieChart()
          break
        case 'doughnut':
          renderDoughnutChart()
          break
      }
    }, [data, type, showValues])

    return (
      <div className={clsx('w-full', className)} {...props}>
        {/* Header */}
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-primary-100 mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-primary-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="relative">
          <canvas
            ref={chartRef}
            className={clsx(
              'w-full rounded-lg',
              sizes[size]
            )}
          />
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.map((item, index) => (
              <div key={item.label} className="flex items-center space-x-2 rtl:space-x-reverse">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getItemColor(item, index) }}
                />
                <span className="text-sm text-primary-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

Chart.displayName = 'Chart'

export default Chart
