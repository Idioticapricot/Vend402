"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { ProfileStats } from "@/components/profile-stats"
import { RecentMatches } from "@/components/recent-matches"
import { Button } from "@/components/ui/button"
import { Settings, Edit, Share, Trophy, TrendingUp } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
    }
    return user.email?.charAt(0).toUpperCase() || 'U'
  }

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getJoinDate = (user: User) => {
    const createdAt = new Date(user.created_at)
    return createdAt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen stadium-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card rounded-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 text-center md:text-left">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen stadium-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="glass-card rounded-xl p-8">
              <h1 className="text-2xl font-bold text-white mb-4">Please Login</h1>
              <p className="text-gray-400">You need to be logged in to view your profile.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen stadium-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={user.user_metadata?.avatar_url || "/placeholder.svg"} 
                    alt={getUserDisplayName(user)}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {getUserDisplayName(user)}
                </h1>
                <p className="text-gray-400 mb-4">
                  {user.email} • Joined {getJoinDate(user)}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    🏆 Champion
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    📈 Top Trader
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    ⭐ VIP Member
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-emerald-400 mb-2">2,847.50</div>
              <div className="text-gray-400">Total ALGO Won</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">156</div>
              <div className="text-gray-400">Matches Won</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">73.2%</div>
              <div className="text-gray-400">Win Rate</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">#47</div>
              <div className="text-gray-400">Global Rank</div>
            </motion.div>
          </div>

          {/* Profile Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileStats />
              <RecentMatches />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="text-white font-medium">Tournament Winner</div>
                      <div className="text-gray-400 text-sm">Won Daily Championship</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <div className="text-2xl">📈</div>
                    <div>
                      <div className="text-white font-medium">Profit Master</div>
                      <div className="text-gray-400 text-sm">+500% portfolio gain</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <div className="text-white font-medium">Speed Demon</div>
                      <div className="text-gray-400 text-sm">10 wins in a row</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Referral Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Referral Program</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Friends Referred</span>
                    <span className="text-white font-bold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bonus Earned</span>
                    <span className="text-emerald-400 font-bold">147.5 ALGO</span>
                  </div>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white">
                    Invite Friends
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
