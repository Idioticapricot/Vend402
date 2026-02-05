"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  time: string
  playerProfit: number
  opponentProfit: number
}

interface ProfitChartProps {
  data: ChartData[]
}

export function ProfitChart({ data }: ProfitChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find min/max values
    const allProfits = data.flatMap(d => [d.playerProfit, d.opponentProfit])
    const minProfit = Math.min(...allProfits) - 0.1
    const maxProfit = Math.max(...allProfits) + 0.1

    // Draw grid lines
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)'
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = maxProfit - (maxProfit - minProfit) * (i / 5)
      
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = 'rgba(156, 163, 175, 1)'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${value.toFixed(3)}%`, padding - 10, y + 4)
    }

    // Draw player profit line (green)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
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

    // Draw opponent profit line (red)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 3
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

    // Draw current value indicators
    if (data.length > 0) {
      const lastPoint = data[data.length - 1]
      
      // Player indicator (green)
      const playerX = padding + chartWidth
      const playerY = padding + chartHeight - ((lastPoint.playerProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
      
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(playerX, playerY, 6, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(playerX, playerY, 3, 0, 2 * Math.PI)
      ctx.fill()

      // Opponent indicator (red)
      const opponentY = padding + chartHeight - ((lastPoint.opponentProfit - minProfit) / (maxProfit - minProfit)) * chartHeight
      
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(playerX, opponentY, 6, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(playerX, opponentY, 3, 0, 2 * Math.PI)
      ctx.fill()

      // Value labels
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${lastPoint.playerProfit.toFixed(3)}%`, playerX + 15, playerY + 5)

      ctx.fillStyle = '#ef4444'
      ctx.fillText(`${lastPoint.opponentProfit.toFixed(3)}%`, playerX + 15, opponentY + 5)
    }

    // Draw time labels
    ctx.fillStyle = 'rgba(156, 163, 175, 1)'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'

    const timeLabels = data.filter((_, index) => index % Math.ceil(data.length / 4) === 0)
    timeLabels.forEach((point, index) => {
      const x = padding + (chartWidth / (timeLabels.length - 1)) * index
      ctx.fillText(point.time, x, rect.height - 10)
    })

  }, [data])

  return (
    <div className="w-full h-64 bg-gray-900/50 rounded-lg p-4">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
