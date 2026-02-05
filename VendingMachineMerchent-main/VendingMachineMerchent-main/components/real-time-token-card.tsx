"use client"

import { motion } from "framer-motion"
import { CryptoToken } from "@/lib/crypto-api"
import { TrendingUp, TrendingDown } from 'lucide-react'

interface RealTimeTokenCardProps {
  token: CryptoToken
  isSelected: boolean
  onSelect: () => void
}

export function RealTimeTokenCard({ token, isSelected, onSelect }: RealTimeTokenCardProps) {
  const isPositive = token.price_change_percentage_24h >= 0

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
        isSelected
          ? "border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/25"
          : "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70"
      }`}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">{token.image}</div>
        <div className="text-white font-bold text-sm">{token.symbol}</div>
        <div className="text-gray-400 text-xs mb-2">{token.name}</div>
        
        {/* Real-time Price */}
        <div className="text-white text-xs font-mono mb-1">
          ${token.current_price.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })}
        </div>
        
        {/* 24h Change */}
        <div className={`flex items-center justify-center gap-1 text-xs font-bold ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
        </div>
        
        {/* Market Cap Rank */}
        <div className="text-gray-500 text-xs mt-1">
          Rank #{token.market_cap_rank}
        </div>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}

      {/* Live Price Indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
      />
    </motion.div>
  )
}
