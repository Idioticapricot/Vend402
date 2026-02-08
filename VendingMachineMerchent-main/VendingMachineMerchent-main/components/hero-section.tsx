"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, Box, ArrowRight, Activity, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthModal } from "./auth-modal"

export function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    checkUser()
  }, [])

  const handleStart = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <>
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={item} className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Stellar Network Integrated
            </motion.div>

            <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Next-Gen Payments for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                IoT Vending Machines
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Accept XLM instantly. Manage your fleet in real-time. Deploy smart contracts with zero code. The complete vending solution for the Stellar ecosystem.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            >
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
                onClick={handleStart}
              >
                {user ? "Go to Dashboard" : "Start Accepting Payments"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-14 text-lg px-8"
                onClick={() => window.open('https://stellar.org', '_blank')}
              >
                Learn about Stellar
              </Button>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 text-left"
            >
              <FeatureCard
                icon={<Box className="w-6 h-6 text-emerald-400" />}
                title="Smart Contract Deployment"
                description="Deploy a unique contract for each machine with custom pricing and inventory logic efficiently."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-amber-400" />}
                title="Instant XLM Settlements"
                description="Payments land directly in your wallet. No intermediaries, no holding periods, near-zero fees."
              />
              <FeatureCard
                icon={<Activity className="w-6 h-6 text-cyan-400" />}
                title="Real-time Analytics"
                description="Track sales, monitor volume, and visualize revenue growth with our professional dashboard."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div variants={item} className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl hover:bg-slate-900/60 hover:border-emerald-500/20 transition-all group backdrop-blur-sm">
      <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-700/50">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
