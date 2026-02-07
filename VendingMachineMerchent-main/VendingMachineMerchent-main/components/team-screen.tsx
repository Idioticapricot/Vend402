"use client"

import { motion } from "framer-motion"
import { X, Settings, Users, Trophy, TrendingUp, TrendingDown, Plus, Share } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function TeamScreen() {
  const players = [
    { id: 1, name: "SURI", rating: 84, position: "ST", avatar: "👨‍💼", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "AAVE", rating: 85, position: "ST", avatar: "👨‍🦱", color: "from-emerald-500 to-teal-500" },
    { id: 3, name: "Player 3", rating: 83, position: "MF", avatar: "👨‍💻", color: "from-blue-500 to-indigo-500" },
    { id: 4, name: "Player 4", rating: 82, position: "MF", avatar: "👨‍🎓", color: "from-yellow-500 to-orange-500" }
  ]

  return (
    <div className="p-4 text-white min-h-[600px] relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-lg">🎮</span>
          </div>
          <div>
            <h1 className="font-bold">testinguser7</h1>
            <p className="text-emerald-400 text-sm">Claim SNS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Share className="w-5 h-5 text-gray-400" />
          <Settings className="w-5 h-5 text-gray-400" />
          <X className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>

      {/* Announcement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-gray-700/30 flex items-center justify-between"
      >
        <div>
          <p className="text-white text-sm font-medium">ANNOUNCEMENT</p>
          <p className="text-gray-400 text-xs">Claim your CFL username for free <span className="text-emerald-400">here</span></p>
        </div>
        <X className="w-4 h-4 text-gray-400" />
      </motion.div>

      {/* Trophy and Referrals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between mb-6"
      >
        <div className="bg-yellow-500/20 rounded-xl p-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-yellow-500 text-sm font-bold">7</p>
            <p className="text-gray-400 text-xs">1d 7h</p>
          </div>
        </div>
        <div className="bg-blue-500/20 rounded-xl p-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white text-sm font-bold">Referrals</p>
          </div>
        </div>
        <div className="bg-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-white text-sm font-bold">SNS</p>
          </div>
        </div>
        <div className="bg-purple-500/20 rounded-xl p-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-white text-sm font-bold">MagicBlock Quest</p>
          </div>
        </div>
      </motion.div>

      {/* Team Formation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-emerald-800/40 to-teal-900/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-emerald-600/30 relative overflow-hidden min-h-[300px]"
      >
        {/* Field Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/30" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Players */}
        <div className="relative z-10 h-full">
          {/* Top Row */}
          <div className="flex justify-center gap-8 mb-8">
            {players.slice(0, 2).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`w-16 h-20 bg-gradient-to-br ${player.color} rounded-xl flex flex-col items-center justify-center relative`}
              >
                <div className="text-2xl mb-1">{player.avatar}</div>
                <div className="absolute -bottom-6 bg-gray-900 px-2 py-1 rounded text-xs">
                  <div className="text-white font-bold">{player.name}</div>
                  <div className="text-emerald-400 text-xs">({player.rating}) {player.position}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex justify-center gap-8">
            {players.slice(2, 4).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className={`w-16 h-20 bg-gradient-to-br ${player.color} rounded-xl flex flex-col items-center justify-center relative`}
              >
                <div className="text-2xl mb-1">{player.avatar}</div>
                <div className="absolute -bottom-6 bg-gray-900 px-2 py-1 rounded text-xs">
                  <div className="text-white font-bold">{player.name}</div>
                  <div className="text-emerald-400 text-xs">({player.rating}) {player.position}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4 mb-4"
      >
        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Long
          <span className="bg-black/20 px-2 py-1 rounded text-sm">+7</span>
        </Button>
        <Button className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl">
          <span className="text-lg">⏱️</span>
          <span className="text-sm ml-1">1m</span>
        </Button>
        <Button className="flex-1 bg-red-500 hover:bg-red-400 text-white py-3 rounded-xl flex items-center justify-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Short
        </Button>
      </motion.div>

      {/* Add New */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30"
      >
        <div>
          <p className="text-white font-bold">23</p>
          <p className="text-emerald-400 text-sm">1.43%</p>
        </div>
        <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </motion.div>
    </div>
  )
}
