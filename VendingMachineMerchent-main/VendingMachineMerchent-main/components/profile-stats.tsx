"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react'

export function ProfileStats() {
  const performanceData = [
    { month: "Jan", profit: 245 },
    { month: "Feb", profit: 189 },
    { month: "Mar", profit: 378 },
    { month: "Apr", profit: 156 },
    { month: "May", profit: 423 },
    { month: "Jun", profit: 298 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Performance Overview</h3>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-emerald-500/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Total Profit</span>
          </div>
          <div className="text-2xl font-bold text-white">+2,847.50 ALGO</div>
          <div className="text-emerald-400 text-sm">+23.4% this month</div>
        </div>

        <div className="bg-red-500/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Total Loss</span>
          </div>
          <div className="text-2xl font-bold text-white">-892.30 ALGO</div>
          <div className="text-red-400 text-sm">-8.1% this month</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-4">Monthly Performance</h4>
        <div className="flex items-end gap-2 h-32">
          {performanceData.map((data, index) => (
            <motion.div
              key={data.month}
              initial={{ height: 0 }}
              animate={{ height: `${(data.profit / 500) * 100}%` }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex-1 bg-emerald-500 rounded-t min-h-[20px] relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                {data.profit}
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                {data.month}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategy Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-800/30 rounded-lg">
          <div className="text-emerald-400 text-2xl font-bold">68%</div>
          <div className="text-gray-400 text-sm">Long Positions</div>
        </div>
        <div className="text-center p-4 bg-gray-800/30 rounded-lg">
          <div className="text-red-400 text-2xl font-bold">32%</div>
          <div className="text-gray-400 text-sm">Short Positions</div>
        </div>
      </div>
    </motion.div>
  )
}
