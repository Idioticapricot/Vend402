"use client"

import { motion } from "framer-motion"
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function LiveMatchesScreen() {
  const liveMatches = [
    {
      id: 1,
      username: "Eons****4Do",
      status: "Pending",
      percentage: "2.33% : 1.61%",
      time: "01:55:56",
      duration: "12h",
      opponent: "xboost_io",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      username: "youssefd...",
      status: "Leading",
      percentage: "1.92% : 2.29%",
      time: "02:56:51",
      duration: "1d",
      opponent: "web3_genx",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: 3,
      username: "josebrice...",
      status: "Leading",
      percentage: "3.48% : -1.30%",
      time: "03:00:54",
      duration: "1d",
      opponent: "sol_flash9",
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 4,
      username: "ronaldo",
      status: "Leading",
      percentage: "-0.32% : -0.02%",
      time: "03:02:05",
      duration: "4h",
      opponent: "gmfocus55",
      color: "from-blue-500 to-indigo-500"
    }
  ]

  return (
    <div className="p-4 text-white min-h-[600px]">
      {/* Header Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-6"
      >
        <Button className="bg-emerald-500 text-white px-6 py-2 rounded-full">
          Live Match
        </Button>
        <Button className="bg-gray-700 text-gray-300 px-6 py-2 rounded-full">
          History
        </Button>
      </motion.div>

      {/* Live Matches List */}
      <div className="space-y-4">
        {liveMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${match.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{match.username}</span>
                    <span className="text-gray-400">⭐</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-400">● Live match</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-xs text-gray-400">{match.opponent}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-emerald-400 font-bold">{match.percentage}</div>
                <div className="text-gray-400 text-sm">{match.time}</div>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{match.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                match.status === "Leading" 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {match.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
          Load More Matches
        </Button>
      </motion.div>
    </div>
  )
}
