"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Coins, TrendingUp } from 'lucide-react'

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "12,847",
      label: "Active Players",
      color: "text-emerald-400"
    },
    {
      icon: Trophy,
      value: "₳ 2.4M",
      label: "Total Prizes Won",
      color: "text-yellow-400"
    },
    {
      icon: Coins,
      value: "₳ 45K",
      label: "Daily Volume",
      color: "text-blue-400"
    },
    {
      icon: TrendingUp,
      value: "89%",
      label: "Player Satisfaction",
      color: "text-purple-400"
    }
  ]

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Thousands of Players
          </h2>
          <p className="text-xl text-gray-300">
            The most exciting crypto fantasy league on Algorand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-8 text-center hover:bg-gray-800/60 transition-colors"
              >
                <div className={`w-16 h-16 ${stat.color.replace('text-', 'bg-').replace('-400', '-500/20')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
