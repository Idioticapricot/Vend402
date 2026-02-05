"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Twitter, Github, DiscIcon as Discord } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">AFL.so</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate Algorand fantasy league. Build your squad, compete with others, and win big prizes in the most exciting crypto trading game.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Discord className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/arena" className="block text-gray-400 hover:text-white transition-colors">
                Arena
              </Link>
              <Link href="/tournament" className="block text-gray-400 hover:text-white transition-colors">
                Tournaments
              </Link>
              <Link href="/profile" className="block text-gray-400 hover:text-white transition-colors">
                Profile
              </Link>
              <Link href="/leaderboard" className="block text-gray-400 hover:text-white transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2024 AFL.so - Algorand Fantasy League. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
