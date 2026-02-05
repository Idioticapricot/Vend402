"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, Clock, Trophy, Crown, Zap } from 'lucide-react'
import Link from 'next/link'

interface Tournament {
  id: number
  title: string
  prizePool: string
  entryFee: string
  players: string
  timeLeft: string
  type: "free" | "premium" | "vip"
  difficulty: string
}

interface TournamentCardProps {
  tournament: Tournament
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const getTypeIcon = () => {
    switch (tournament.type) {
      case "free":
        return <Users className="w-5 h-5" />
      case "premium":
        return <Crown className="w-5 h-5" />
      case "vip":
        return <Zap className="w-5 h-5" />
      default:
        return <Users className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (tournament.type) {
      case "free":
        return "from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
      case "premium":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
      case "vip":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30"
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30"
    }
  }

  const getButtonColor = () => {
    switch (tournament.type) {
      case "free":
        return "bg-emerald-500 hover:bg-emerald-400"
      case "premium":
        return "bg-yellow-500 hover:bg-yellow-400 text-black"
      case "vip":
        return "bg-purple-500 hover:bg-purple-400"
      default:
        return "bg-gray-500 hover:bg-gray-400"
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-xl p-6 border bg-gradient-to-br ${getTypeColor()}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getTypeIcon()}
          <span className="text-white font-semibold capitalize">{tournament.type}</span>
        </div>
        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
          {tournament.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-4">{tournament.title}</h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Trophy className="w-4 h-4" />
            <span>Prize Pool</span>
          </div>
          <span className="text-yellow-400 font-bold">{tournament.prizePool}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Players</span>
          </div>
          <span className="text-white">{tournament.players}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Time Left</span>
          </div>
          <span className="text-white">{tournament.timeLeft}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{tournament.entryFee}</div>
          <div className="text-gray-400 text-sm">Entry Fee</div>
        </div>
        <Button className={`${getButtonColor()} text-white px-6 py-2`}>
          <Link href={`/tournament/${tournament.id}/join`} className="flex items-center gap-2">
            Join Tournament
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
