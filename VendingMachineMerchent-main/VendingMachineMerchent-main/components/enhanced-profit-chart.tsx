"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface ChartData {
  time: string
  playerProfit: number
  opponentProfit: number
  timestamp: number
}

interface EnhancedProfitChartProps {
  data: ChartData[]
  isLive?: boolean
}

export function EnhancedProfitChart({ data, isLive = false }: EnhancedProfitChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, data: ChartData } | null>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Set canvas size
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)')
      gradient.addColorStop(1, 'rgba(17, 24, 39, 0.8)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Chart dimensions
      const padding = 50
      const chartWidth = rect.width - padding * 2
      const chartHeight = rect.height - padding * 2

      // Find min/max values with some padding
      const allProfits = data.flatMap(d => [d.playerProfit, d.opponentProfit])
      const minProfit = Math.min(...allProfits) - 0.2
      const maxProfit = Math.max(...allProfits) + 0.2

      // Draw grid lines with glow effect
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(75, 85, 99, 0.5)'
      ctx.shadowBlur = 2

      // Horizontal grid lines
      for (let i = 0; i <= 6; i++) {
        const y = padding + (chartHeight / 6) * i
        const value = maxProfit - (maxProfit - minProfit) * (i / 6)
        
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(padding + chartWidth, y)
        ctx.stroke()

        // Y-axis labels with better styling
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(156, 163, 175, 0.8)'
        ctx.font = 'bold 11px system-ui'
        ctx.textAlign = 'right'
        ctx.fillText(`${value.toFixed(2)}%`, padding - 15, y + 4)
      }

      // Draw area fills first (behind lines)
      const createAreaGradient = (color: string, opacity: number) => {
        const areaGradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
        areaGradient.addColorStop(0, color.replace('1)', `${opacity})`))
        areaGradient.addColorStop(1, color.replace('1)', '0)'))
        return areaGradient
      }

      // Player area fill (green)
      ctx.fillStyle = createAreaGradient('rgba(16, 185, 129, 1)', 0.2)
      ctx.beginPath()
      ctx.moveTo(padding, padding + chartHeight)
      
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = padding + chartHeight - ((point.playerProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
        if (index === 0) {
          ctx.lineTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.closePath()
      ctx.fill()

      // Opponent area fill (red)
      ctx.fillStyle = createAreaGradient('rgba(239, 68, 68, 1)', 0.2)
      ctx.beginPath()
      ctx.moveTo(padding, padding + chartHeight)
      
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = padding + chartHeight - ((point.opponentProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
        if (index === 0) {
          ctx.lineTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.closePath()
      ctx.fill()

      // Draw player profit line (green) with glow
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 3
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 8
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = padding + chartHeight - ((point.playerProfit - minProfit) / (maxProfit - minProfit)) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw opponent profit line (red) with glow
      ctx.strokeStyle = '#ef4444'
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 8
      ctx.beginPath()

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = padding + chartHeight - ((point.opponentProfit - minProfit) / (maxProfit - minProfit)) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw animated current value indicators
      if (data.length > 0) {
        const lastPoint = data[data.length - 1]
        const time = Date.now() * 0.003
        
        // Player indicator (green) with pulse animation
        const playerX = padding + chartWidth
        const playerY = padding + chartHeight - ((lastPoint.playerProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
        
        // Outer pulse ring
        const pulseRadius = 8 + Math.sin(time) * 2
        ctx.shadowBlur = 15
        ctx.shadowColor = '#10b981'
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
        ctx.beginPath()
        ctx.arc(playerX, playerY, pulseRadius, 0, 2 * Math.PI)
        ctx.fill()
        
        // Main indicator
        ctx.shadowBlur = 10
        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(playerX, playerY, 6, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(playerX, playerY, 3, 0, 2 * Math.PI)
        ctx.fill()

        // Opponent indicator (red) with pulse animation
        const opponentY = padding + chartHeight - ((lastPoint.opponentProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
        
        // Outer pulse ring
        ctx.shadowBlur = 15
        ctx.shadowColor = '#ef4444'
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'
        ctx.beginPath()
        ctx.arc(playerX, opponentY, pulseRadius, 0, 2 * Math.PI)
        ctx.fill()
        
        // Main indicator
        ctx.shadowBlur = 10
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(playerX, opponentY, 6, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(playerX, opponentY, 3, 0, 2 * Math.PI)
        ctx.fill()

        // Value labels with background
        ctx.shadowBlur = 0
        const drawLabel = (text: string, x: number, y: number, color: string) => {
          ctx.font = 'bold 13px system-ui'
          const metrics = ctx.measureText(text)
          const labelWidth = metrics.width + 16
          const labelHeight = 24
          
          // Background
          ctx.fillStyle = 'rgba(17, 24, 39, 0.9)'
          ctx.fillRect(x, y - labelHeight/2, labelWidth, labelHeight)
          
          // Border
          ctx.strokeStyle = color
          ctx.lineWidth = 1
          ctx.strokeRect(x, y - labelHeight/2, labelWidth, labelHeight)
          
          // Text
          ctx.fillStyle = color
          ctx.textAlign = 'left'
          ctx.fillText(text, x + 8, y + 4)
        }

        drawLabel(`${lastPoint.playerProfit.toFixed(3)}%`, playerX + 15, playerY, '#10b981')
        drawLabel(`${lastPoint.opponentProfit.toFixed(3)}%`, playerX + 15, opponentY, '#ef4444')
      }

      // Draw time labels
      ctx.fillStyle = 'rgba(156, 163, 175, 0.8)'
      ctx.font = '10px system-ui'
      ctx.textAlign = 'center'

      const timeLabels = data.filter((_, index) => index % Math.ceil(data.length / 5) === 0)
      timeLabels.forEach((point, index) => {
        const x = padding + (chartWidth / (timeLabels.length - 1)) * index
        ctx.fillText(point.time, x, rect.height - 15)
      })

      if (isLive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data, isLive])

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-4 border border-gray-700/50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Live indicator */}
      {isLive && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-400 text-xs font-medium">LIVE</span>
        </motion.div>
      )}
    </div>
  )
}
