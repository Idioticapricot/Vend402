"use client"

import { motion } from "framer-motion"
import { Download, Upload, Key, Share, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ProfileScreen() {
  return (
    <div className="p-4 text-white min-h-[600px]">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-xl">🎮</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">testingalgo7</h1>
            <p className="text-gray-400 text-sm">5WbC****H9KJ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Share className="w-5 h-5 text-gray-400" />
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>

      {/* Balance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-4xl font-bold">0.00</h2>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
        </div>
        <p className="text-gray-400">$0.00 USD</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl flex flex-col items-center gap-2">
          <Download className="w-5 h-5" />
          <span className="text-sm">Deposit</span>
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" />
          <span className="text-sm">Withdraw</span>
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl flex flex-col items-center gap-2">
          <Key className="w-5 h-5" />
          <span className="text-sm">Export PK</span>
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-2 mb-6"
      >
        <Button className="bg-emerald-500 text-white px-6 py-2 rounded-full">
          Live
        </Button>
        <Button className="bg-gray-700 text-gray-300 px-6 py-2 rounded-full">
          Tournaments
        </Button>
        <Button className="bg-gray-700 text-gray-300 px-6 py-2 rounded-full">
          Ended
        </Button>
      </motion.div>

      {/* No Active Matches */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚽</span>
        </div>
        <h3 className="text-xl font-bold mb-2">No Active Matches</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          You're not participating in any matches right now. Open a match or go to the lobby to get started.
        </p>
      </motion.div>
    </div>
  )
}
