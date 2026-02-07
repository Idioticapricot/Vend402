"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Settings, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function TournamentScreen() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 19,
    seconds: 17
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const calendarDays = [
    { day: 3, label: "Sun" },
    { day: 4, label: "Mon" },
    { day: 5, label: "Tue" },
    { day: 6, label: "Wed" },
    { day: 7, label: "Thu", active: true },
    { day: 8, label: "Fri" },
    { day: 9, label: "Sat" }
  ]

  return (
    <div className="p-4 text-white min-h-[600px] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-xs text-gray-400 mb-1">AUGUST 2025</h1>
        <div className="flex justify-center gap-2 mb-4">
          {calendarDays.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center ${day.active ? 'bg-yellow-500 text-black' : 'text-gray-400'} rounded-lg px-2 py-1 min-w-[40px]`}
            >
              <div className="text-lg font-bold">{day.day}</div>
              <div className="text-xs">{day.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Tournament Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-teal-800/80 to-emerald-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-teal-600/30 relative overflow-hidden"
      >
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-teal-400/20" />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-4"
          >
            <h2 className="text-sm text-teal-300 mb-2">STELLAR</h2>
            <h1 className="text-lg font-bold text-emerald-300 mb-4">FANTASY LEAGUE</h1>

            <div className="mb-4">
              <div className="text-yellow-400 text-2xl font-bold mb-1">JOIN WITH 5 XLM AND</div>
              <div className="text-yellow-400 text-lg font-bold mb-2">WIN TOTAL PRIZES OF</div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="text-yellow-400 text-4xl font-bold"
              >
                550.00 XLM
              </motion.div>
            </div>

            <div className="mb-6">
              <div className="text-white text-sm mb-2">Tournament Will Start In</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-1 text-yellow-400"
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl">
                Prize Detail
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tournament Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="space-y-3 mb-6"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Duration</span>
          </div>
          <span className="text-white">5m Match</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Players Joined</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-400">View All</span>
            <span className="text-white">48/100</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Settings className="w-4 h-4" />
            <span>Entry Options</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Squad Limit</span>
            <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
          </div>
          <span className="text-white">0/3</span>
        </div>
      </motion.div>

      {/* Join Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-auto"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl text-lg">
            Join with XLM
            <div className="ml-2 bg-black/20 px-2 py-1 rounded text-sm">
              5.0
            </div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
