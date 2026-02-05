"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { EnhancedProfitChart } from "@/components/enhanced-profit-chart"
import { cryptoAPI } from "@/lib/crypto-api"
import { Share, Clock } from 'lucide-react'

interface MatchData {
  id: string
  opponent: string
  playerName: string
  duration: string
  timeLeft: string
  playerProfit: number
  opponentProfit: number
  isLeading: boolean
  entryFee: string
  prizePool: string
}

interface LiveMatchTrackerProps {
  matchData: MatchData
  onMatchComplete: () => void
}

export function LiveMatchTracker({ matchData, onMatchComplete }: LiveMatchTrackerProps) {
  const [currentData, setCurrentData] = useState(matchData)
  const [chartData, setChartData] = useState<any[]>([])

  // Simulate real-time data updates with more realistic crypto movements
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      // More realistic crypto-like price movements
      const volatility = 0.05 // 5% volatility
      const trend = Math.sin(Date.now() / 10000) * 0.02 // Slight trending
      
      const playerChange = (Math.random() - 0.5) * volatility + trend
      const opponentChange = (Math.random() - 0.5) * volatility - trend * 0.5

      const newPlayerProfit = Math.max(-10, Math.min(10, currentData.playerProfit + playerChange))
      const newOpponentProfit = Math.max(-10, Math.min(10, currentData.opponentProfit + opponentChange))

      setCurrentData(prev => ({
        ...prev,
        playerProfit: newPlayerProfit,
        opponentProfit: newOpponentProfit,
        isLeading: newPlayerProfit > newOpponentProfit
      }))

      // Add to chart data
      setChartData(prev => {
        const newData = [
          ...prev,
          {
            time: timeString,
            playerProfit: newPlayerProfit,
            opponentProfit: newOpponentProfit,
            timestamp: Date.now()
          }
        ].slice(-50) // Keep last 50 data points for smooth animation

        return newData
      })
    }, 1000) // Update every second for smoother animation

    return () => clearInterval(interval)
  }, [currentData.playerProfit, currentData.opponentProfit])

  // Initialize chart data with realistic starting points
  useEffect(() => {
    const initialData = []
    for (let i = 0; i < 20; i++) {
      const time = new Date(Date.now() - (20 - i) * 1000)
      const basePlayerProfit = currentData.playerProfit
      const baseOpponentProfit = currentData.opponentProfit
      
      initialData.push({
        time: time.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        playerProfit: basePlayerProfit + (Math.random() - 0.5) * 0.5,
        opponentProfit: baseOpponentProfit + (Math.random() - 0.5) * 0.5,
        timestamp: time.getTime()
      })
    }
    setChartData(initialData)
  }, [])

  return (
    <div className="space-y-6">
      {/* Enhanced Mobile-style Match Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Phone Frame */}
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-[2.5rem] p-4 shadow-2xl border border-gray-700/50">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 text-white text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="font-medium">0.00</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">+</span>
              </div>
            </div>
          </div>

          {/* Live Match Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-orange-400 text-sm font-medium">Live match</span>
            </div>
            
            <div className="text-3xl font-bold mb-2">
              <span className="text-emerald-400">{currentData.playerProfit.toFixed(2)}%</span>
              <span className="text-gray-400 mx-2">:</span>
              <span className="text-red-400">{currentData.opponentProfit.toFixed(2)}%</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-white font-mono">{currentData.timeLeft}</span>
            </div>

            <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
              currentData.isLeading 
                ? "bg-emerald-500/20 text-emerald-400" 
                : "bg-red-500/20 text-red-400"
            }`}>
              {currentData.isLeading ? "Leading" : "Behind"}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <div>
                <div className="text-white font-bold">{currentData.playerName}</div>
                <div className="text-gray-400 text-sm">{currentData.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-white font-bold text-right">{currentData.opponent}</div>
                <div className="text-gray-400 text-sm text-right">Opponent</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
          </div>

          {/* Enhanced Profit Chart */}
          <div className="mb-6">
            <EnhancedProfitChart data={chartData} isLive={true} />
          </div>

          {/* Player Comparison */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-sm">🎮</span>
              </div>
              <span className="text-white font-medium">{currentData.playerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{currentData.opponent}</span>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
            </div>
          </div>

          {/* Share Results Button */}
          <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Share className="w-4 h-4" />
            Share Results
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Match Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Live Match Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-emerald-400 font-semibold mb-3">Your Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Profit</span>
                <span className="text-emerald-400 font-bold">
                  {currentData.playerProfit >= 0 ? '+' : ''}{currentData.playerProfit.toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Peak Profit</span>
                <span className="text-white">
                  +{Math.max(...chartData.map(d => d.playerProfit || 0)).toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy</span>
                <span className="text-white">📈 Long</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility</span>
                <span className="text-white">
                  {(Math.max(...chartData.map(d => d.playerProfit || 0)) - 
                    Math.min(...chartData.map(d => d.playerProfit || 0))).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-red-400 font-semibold mb-3">Opponent Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Profit</span>
                <span className="text-red-400 font-bold">
                  {currentData.opponentProfit >= 0 ? '+' : ''}{currentData.opponentProfit.toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Peak Profit</span>
                <span className="text-white">
                  +{Math.max(...chartData.map(d => d.opponentProfit || 0)).toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy</span>
                <span className="text-white">📉 Short</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility</span>
                <span className="text-white">
                  {(Math.max(...chartData.map(d => d.opponentProfit || 0)) - 
                    Math.min(...chartData.map(d => d.opponentProfit || 0))).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
