"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, TrendingDown, Clock } from 'lucide-react'

export function RecentMatches() {
  const recentMatches = [
    {
      id: 1,
      opponent: "CryptoKing99",
      result: "win",
      profit: "+156.7 XLM",
      duration: "2h 45m",
      strategy: "Long",
      date: "2 hours ago"
    },
    {
      id: 2,
      opponent: "AlgoTrader",
      result: "loss",
      profit: "-89.2 XLM",
      duration: "1h 30m",
      strategy: "Short",
      date: "1 day ago"
    },
    {
      id: 3,
      opponent: "DeFiMaster",
      result: "win",
      profit: "+234.5 XLM",
      duration: "4h 15m",
      strategy: "Long",
      date: "2 days ago"
    },
    {
      id: 4,
      opponent: "TokenHunter",
      result: "win",
      profit: "+78.9 XLM",
      duration: "1h 20m",
      strategy: "Short",
      date: "3 days ago"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Recent Matches</h3>

      <div className="space-y-4">
        {recentMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${match.result === 'win'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                {match.result === 'win' ? <Trophy className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-white font-semibold">vs {match.opponent}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{match.duration}</span>
                  <span>•</span>
                  <span className={match.strategy === 'Long' ? 'text-emerald-400' : 'text-red-400'}>
                    {match.strategy === 'Long' ? '📈' : '📉'} {match.strategy}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`font-bold ${match.result === 'win' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                {match.profit}
              </div>
              <div className="text-gray-400 text-sm">{match.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
