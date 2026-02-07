"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react'

export function MatchHistory() {
  const matchHistory = [
    {
      id: "match_001",
      opponent: "CryptoKing99",
      result: "win",
      profit: "+156.7 XLM",
      profitPercent: "+12.4%",
      duration: "2h 45m",
      strategy: "Long",
      date: "2 hours ago",
      finalScore: "3.45% : 2.12%"
    },
    {
      id: "match_002",
      opponent: "AlgoTrader",
      result: "loss",
      profit: "-89.2 XLM",
      profitPercent: "-7.8%",
      duration: "1h 30m",
      strategy: "Short",
      date: "1 day ago",
      finalScore: "1.23% : 2.89%"
    },
    {
      id: "match_003",
      opponent: "DeFiMaster",
      result: "win",
      profit: "+234.5 XLM",
      profitPercent: "+18.9%",
      duration: "4h 15m",
      strategy: "Long",
      date: "2 days ago",
      finalScore: "5.67% : 3.21%"
    },
    {
      id: "match_004",
      opponent: "TokenHunter",
      result: "win",
      profit: "+78.9 XLM",
      profitPercent: "+6.2%",
      duration: "1h 20m",
      strategy: "Short",
      date: "3 days ago",
      finalScore: "2.34% : 1.98%"
    },
    {
      id: "match_005",
      opponent: "Web3Wizard",
      result: "loss",
      profit: "-145.3 XLM",
      profitPercent: "-11.2%",
      duration: "3h 10m",
      strategy: "Long",
      date: "5 days ago",
      finalScore: "1.45% : 4.67%"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Match Statistics</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">73.2%</div>
            <div className="text-gray-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">156</div>
            <div className="text-gray-400">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">+2,847</div>
            <div className="text-gray-400">Total XLM Won</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">2h 15m</div>
            <div className="text-gray-400">Avg Duration</div>
          </div>
        </div>
      </motion.div>

      {/* Match History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Recent Matches</h3>
        <div className="space-y-4">
          {matchHistory.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${match.result === 'win'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                  }`}>
                  {match.result === 'win' ? <Trophy className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-white font-semibold">vs {match.opponent}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{match.duration}</span>
                    </div>
                    <span className={match.strategy === 'Long' ? 'text-emerald-400' : 'text-red-400'}>
                      {match.strategy === 'Long' ? '📈' : '📉'} {match.strategy}
                    </span>
                    <span>Final: {match.finalScore}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-bold text-lg ${match.result === 'win' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {match.profit}
                </div>
                <div className={`text-sm ${match.result === 'win' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {match.profitPercent}
                </div>
                <div className="text-gray-400 text-xs">{match.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Performance Trend</h3>
        <div className="h-64 flex items-end gap-2">
          {matchHistory.slice().reverse().map((match, index) => {
            const isWin = match.result === 'win'
            const height = Math.abs(parseFloat(match.profitPercent.replace('%', '').replace('+', '').replace('-', ''))) * 3

            return (
              <motion.div
                key={match.id}
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(height, 100)}%` }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex-1 rounded-t min-h-[20px] relative ${isWin ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                  {match.profitPercent}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                  {match.date.split(' ')[0]}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
