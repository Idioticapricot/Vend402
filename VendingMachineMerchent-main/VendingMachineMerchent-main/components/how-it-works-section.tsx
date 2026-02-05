"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, Target } from 'lucide-react'

export function HowItWorksSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Crypto Fantasy League (AFL.so) - The ultimate crypto trading competition on Algorand
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-12 mb-20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-3xl font-bold text-white">Build your Squad</h3>
              </div>
              <p className="text-lg text-gray-300 mb-6">
                Pick up to 10 tokens and set their ratio on your portfolio. Choose from hundreds of cryptocurrencies and create your perfect trading strategy.
              </p>
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Portfolio Management</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🪙</div>
                    <div className="text-white font-semibold">ALGO</div>
                    <div className="text-emerald-400">30%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">₿</div>
                    <div className="text-white font-semibold">BTC</div>
                    <div className="text-emerald-400">25%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">Ξ</div>
                    <div className="text-white font-semibold">ETH</div>
                    <div className="text-emerald-400">20%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">◎</div>
                    <div className="text-white font-semibold">SOL</div>
                    <div className="text-emerald-400">25%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  2
                </div>
                <h3 className="text-3xl font-bold text-white">Find Opponents</h3>
              </div>
              <p className="text-lg text-gray-300 mb-6">
                Set the bet amount, match duration and match type. Choose your strategy and compete against other players.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <span className="text-white"><strong className="text-emerald-400">📈 Long:</strong> Win by achieving the highest portfolio gain</span>
                </div>
                <div className="flex items-center gap-4">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <span className="text-white"><strong className="text-red-400">📉 Short:</strong> Win by having the largest portfolio loss</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Bet Amount</span>
                    <span className="text-white font-bold">100 ALGO</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Duration</span>
                    <span className="text-white font-bold">24 Hours</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-lg font-bold">
                      📈 Long
                    </button>
                    <button className="bg-red-500 hover:bg-red-400 text-white p-4 rounded-lg font-bold">
                      📉 Short
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-3xl font-bold text-white">Win Big Prizes</h3>
            </div>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Compete in tournaments, climb leaderboards, and win massive ALGO prizes. The more you play, the more you can earn!
            </p>
            <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">₳ 25,000</div>
                <div className="text-gray-300 mb-4">Weekly Prize Pool</div>
                <div className="flex justify-center gap-8">
                  <div>
                    <div className="text-2xl font-bold text-white">🥇</div>
                    <div className="text-yellow-400">40%</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">🥈</div>
                    <div className="text-gray-400">25%</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">🥉</div>
                    <div className="text-orange-400">15%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
