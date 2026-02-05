"use client"

import { motion } from "framer-motion"

export function ReferralHero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-4xl">🎁</span>
      </div>
      <h1 className="text-5xl font-bold text-white mb-4">
        Welcome to AFL.so!
      </h1>
      <p className="text-xl text-gray-300">
        You've been invited to join the ultimate Algorand fantasy league
      </p>
    </motion.div>
  )
}
