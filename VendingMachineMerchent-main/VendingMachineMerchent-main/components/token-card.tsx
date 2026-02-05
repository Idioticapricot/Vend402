"use client"

import { motion } from "framer-motion"

interface Token {
  id: number
  symbol: string
  name: string
  rating: number
  price: number
  change: number
  avatar: string
  allocation?: number
}

interface TokenCardProps {
  token: Token
  isSelected: boolean
  onSelect: () => void
}

export function TokenCard({ token, isSelected, onSelect }: TokenCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
        isSelected
          ? "border-emerald-400 bg-emerald-500/20"
          : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
      }`}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">{token.avatar}</div>
        <div className="text-white font-bold text-sm">{token.symbol}</div>
        <div className="text-gray-400 text-xs mb-2">{token.name}</div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white">({token.rating})</span>
          <span className={`font-bold ${
            token.change >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {token.change >= 0 ? '+' : ''}{token.change}%
          </span>
        </div>
        <div className="text-gray-300 text-xs mt-1">
          ${token.price.toLocaleString()}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </motion.div>
  )
}
