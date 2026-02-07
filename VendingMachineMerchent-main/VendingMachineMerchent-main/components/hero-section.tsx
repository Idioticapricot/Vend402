"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, ShoppingCart, DollarSign } from "lucide-react"
import { useState } from "react"
import { AuthModal } from "./auth-modal"

export function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Vending Machine
              </span>
              <br />
              Dashboard
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Manage your vending machines with smart contracts. Create, deploy, and withdraw funds seamlessly on
              Algorand.
              Manage your vending machines with secure payments. Create, deploy, and withdraw funds seamlessly on
              Stellar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 text-lg"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Login with Google
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-xl p-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Create Vending Machine</h3>
              <p className="text-gray-400">
                Deploy a smart contract for your vending machine with custom pricing and inventory settings
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Accept XLM Payments</h3>
              <p className="text-gray-400">
                Customers deposit XLM to purchase items from your vending machine automatically
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Withdraw Funds</h3>
              <p className="text-gray-400">
                Easily withdraw accumulated XLM from your vending machines to your wallet
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
