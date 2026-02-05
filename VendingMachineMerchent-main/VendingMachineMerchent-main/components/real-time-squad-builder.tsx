"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RealTimeTokenCard } from "@/components/real-time-token-card"
import { cryptoAPI, CryptoToken } from "@/lib/crypto-api"
import { TrendingUp, TrendingDown, Plus, X, RefreshCw } from 'lucide-react'

interface RealTimeSquadBuilderProps {
  matchId: string
  onMatchStart: () => void
}

export function RealTimeSquadBuilder({ matchId, onMatchStart }: RealTimeSquadBuilderProps) {
  const [selectedTokens, setSelectedTokens] = useState<(CryptoToken & { allocation: number })[]>([])
  const [availableTokens, setAvailableTokens] = useState<CryptoToken[]>([])
  const [strategy, setStrategy] = useState<"long" | "short" | null>(null)
  const [matchDuration, setMatchDuration] = useState("1h")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Fetch real crypto data
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true)
      const tokens = await cryptoAPI.getTopTokens(8)
      setAvailableTokens(tokens)
      setIsLoading(false)
      setLastUpdate(Date.now())
    }

    fetchTokens()
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchTokens, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleTokenSelect = (token: CryptoToken) => {
    if (selectedTokens.find(t => t.id === token.id)) {
      setSelectedTokens(selectedTokens.filter(t => t.id !== token.id))
    } else if (selectedTokens.length < 6) {
      setSelectedTokens([...selectedTokens, { ...token, allocation: 16.67 }])
    }
  }

  const updateAllocation = (tokenId: string, allocation: number) => {
    setSelectedTokens(selectedTokens.map(token => 
      token.id === tokenId ? { ...token, allocation } : token
    ))
  }

  const totalAllocation = selectedTokens.reduce((sum, token) => sum + token.allocation, 0)
  const estimatedPerformance = cryptoAPI.calculatePortfolioPerformance(
    selectedTokens, 
    selectedTokens.map(t => t.allocation)
  )

  const refreshPrices = async () => {
    setIsLoading(true)
    const tokens = await cryptoAPI.getTopTokens(8)
    setAvailableTokens(tokens)
    setIsLoading(false)
    setLastUpdate(Date.now())
  }

  return (
    <div className="space-y-8">
      {/* Real-time Market Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Live Market Data</h2>
            <p className="text-gray-400 text-sm">
              Last updated: {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          </div>
          <Button
            onClick={refreshPrices}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
            <div className="text-emerald-400 text-lg font-bold">
              {availableTokens.filter(t => t.price_change_percentage_24h > 0).length}
            </div>
            <div className="text-gray-400 text-sm">Gainers</div>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-lg">
            <div className="text-red-400 text-lg font-bold">
              {availableTokens.filter(t => t.price_change_percentage_24h < 0).length}
            </div>
            <div className="text-gray-400 text-sm">Losers</div>
          </div>
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
            <div className="text-yellow-400 text-lg font-bold">
              {estimatedPerformance.toFixed(2)}%
            </div>
            <div className="text-gray-400 text-sm">Portfolio Est.</div>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-purple-400 text-lg font-bold">
              {selectedTokens.length}/6
            </div>
            <div className="text-gray-400 text-sm">Selected</div>
          </div>
        </div>
      </motion.div>

      {/* Available Tokens with Real-time Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Select Tokens (Live Prices)</h3>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-700 rounded-xl h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {availableTokens.map((token) => (
              <RealTimeTokenCard
                key={token.id}
                token={token}
                isSelected={selectedTokens.some(t => t.id === token.id)}
                onSelect={() => handleTokenSelect(token)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Portfolio Formation */}
      {selectedTokens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Portfolio Squad</h3>
          
          {/* Formation Field */}
          <div className="bg-gradient-to-br from-emerald-800/40 to-teal-900/40 rounded-2xl p-8 mb-6 relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
              <div className="absolute top-1/2 left-4 right-4 h-px bg-white/30" />
              <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-8 h-full items-center">
              {/* Formation Layout */}
              <div className="flex flex-col gap-4 items-center">
                {selectedTokens.slice(0, 2).map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <RealTimeTokenCard token={token} isSelected={true} onSelect={() => {}} />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs">
                      <div className="text-emerald-400">{token.allocation.toFixed(1)}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-4 items-center">
                {selectedTokens.slice(2, 4).map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative"
                  >
                    <RealTimeTokenCard token={token} isSelected={true} onSelect={() => {}} />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs">
                      <div className="text-emerald-400">{token.allocation.toFixed(1)}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-4 items-center">
                {selectedTokens.slice(4, 6).map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative"
                  >
                    <RealTimeTokenCard token={token} isSelected={true} onSelect={() => {}} />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs">
                      <div className="text-emerald-400">{token.allocation.toFixed(1)}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Allocation Controls */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Portfolio Allocation</h4>
              <div className={`text-lg font-bold ${
                Math.abs(totalAllocation - 100) < 0.1 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {totalAllocation.toFixed(1)}%
              </div>
            </div>
            <div className="space-y-3">
              {selectedTokens.map((token) => (
                <div key={token.id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <span className="text-xl">{token.image}</span>
                    <div>
                      <div className="text-white font-medium">{token.symbol}</div>
                      <div className="text-gray-400 text-xs">${token.current_price.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={token.allocation}
                      onChange={(e) => updateAllocation(token.id, parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div className="text-emerald-400 font-bold min-w-[60px] text-right">
                    {token.allocation.toFixed(1)}%
                  </div>
                  <div className={`text-sm font-medium min-w-[60px] text-right ${
                    token.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {token.price_change_percentage_24h >= 0 ? '+' : ''}
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Strategy and Match Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Strategy & Settings</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strategy Selection */}
          <div>
            <h4 className="text-white font-medium mb-3">Choose Strategy</h4>
            <div className="flex gap-3">
              <Button
                onClick={() => setStrategy("long")}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                  strategy === "long"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                📈 Long
              </Button>
              
              <Button
                onClick={() => setStrategy("short")}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                  strategy === "short"
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                📉 Short
              </Button>
            </div>
          </div>

          {/* Match Duration */}
          <div>
            <h4 className="text-white font-medium mb-3">Match Duration</h4>
            <div className="flex gap-2">
              {["1m", "5m", "1h", "12h", "1d"].map((duration) => (
                <Button
                  key={duration}
                  onClick={() => setMatchDuration(duration)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    matchDuration === duration
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {duration}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Prediction */}
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold">Estimated Performance</div>
              <div className="text-gray-400 text-sm">Based on 24h trends</div>
            </div>
            <div className={`text-2xl font-bold ${
              estimatedPerformance >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {estimatedPerformance >= 0 ? '+' : ''}{estimatedPerformance.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Start Match Button */}
        <Button
          onClick={onMatchStart}
          disabled={selectedTokens.length === 0 || !strategy || Math.abs(totalAllocation - 100) > 0.1}
          className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-bold"
        >
          Start Live Match - 100 ALGO
        </Button>
      </motion.div>
    </div>
  )
}
