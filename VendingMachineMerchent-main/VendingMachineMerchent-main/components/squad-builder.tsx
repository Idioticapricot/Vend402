"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TokenCard } from "@/components/token-card"
import { Trophy, TrendingUp, TrendingDown, Plus, X } from 'lucide-react'
import { RealTimeSquadBuilder } from "@/components/real-time-squad-builder"

interface SquadBuilderProps {
  matchId: string
  onMatchStart: () => void
}

export function SquadBuilder({ matchId, onMatchStart }: SquadBuilderProps) {
  return <RealTimeSquadBuilder matchId={matchId} onMatchStart={onMatchStart} />
}
