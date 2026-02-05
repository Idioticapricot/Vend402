"use client"

import { motion } from "framer-motion"
import { Trophy, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function LeaderboardScreen() {
  const leaderboardData = [
    {
      rank: 1,
      username: "algo_master",
      score: 168190,
      prize: 400,
      avatar: "🏆",
      color: "from-yellow-400 to-orange-500"
    },
    {
      rank: 2,
      username: "2v95****MuFc",
      score: 149723,
      prize: 250,
      avatar: "🥈",
      color: "from-gray-300 to-gray-500"
    },
    {
      rank: 3,
      username: "3b65****wd3i",
      score: 84134,
      prize: 100,
      avatar: "🥉",
      color: "from-orange-400 to-red-500"
    },
    {
      rank: 4,
      username: "ickee",
      score: 83190,
      prize: 50,
      avatar: "🎯",
      color: "from-emerald-400 to-teal-500"
    },
    {
      rank: 5,
      username: "3GuT****JrXA",
      score: 82276,
      prize: 50,
      avatar: "⚡",
      color: "from-pink-400 to-purple-500"
    },
    {
      rank: 6,
      username: "kayz",
      score: 75600,
      prize: 30,
      avatar: "🎮",
      color: "from-blue-400 to-indigo-500"
    }
  ]

  return (
    <div className="p-4 text-white min-h-[600px]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-xl font-bold">1,000 ALGO Leaderboard</h1>
          <p className="text-sm text-gray-400">Win & Collect Trophies</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm">
          Details <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>

      {/* Prize Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-6 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h2 className="text-black font-bold text-lg">1,000 ALGO LEADERBOARD</h2>
              <p className="text-black/80 text-sm">Top 10 players will win a share of the 1,000 ALGO prize pool</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-black/60 text-xs">⏰ 20d 7h</div>
            <Button className="bg-black/20 hover:bg-black/30 text-black text-xs px-3 py-1 rounded mt-1">
              View Details
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-4 mb-6"
      >
        {leaderboardData.slice(0, 3).map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`bg-gradient-to-br ${player.color} p-3 rounded-xl text-center min-w-[80px]`}
          >
            <div className="text-2xl mb-1">{player.avatar}</div>
            <div className="text-black font-bold text-lg">#{player.rank}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${player.color} rounded-lg flex items-center justify-center text-lg`}>
                  {player.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">#{player.rank}</span>
                    <span className="text-white">{player.username}</span>
                    {player.username === "ickee" || player.username === "kayz" ? (
                      <span className="text-gray-400">⭐</span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">A</span>
                  </div>
                  <span className="text-emerald-400">+{player.prize} ALGO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-bold">{player.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
