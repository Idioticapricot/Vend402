"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Scale, Shield, AlertTriangle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen stadium-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Scale className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300">
              Last updated: December 2024
            </p>
          </div>

          {/* Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-8 space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Vend402 (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Vend402 is a vending machine management platform that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Create virtual portfolios using real cryptocurrency data</li>
                <li>Compete against other users in matches and tournaments</li>
                <li>Accept XLM tokens for payments</li>
                <li>Participate in leaderboards and ranking systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-2">Age Requirement</h3>
                    <p className="text-gray-300">You must be at least 18 years old to use this service.</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to immediately notify us of any unauthorized use of your account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Financial Terms</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Deposits and Withdrawals</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>All transactions are conducted in XLM tokens on the Stellar blockchain</li>
                  <li>Minimum deposit and withdrawal amounts may apply</li>
                  <li>Withdrawal processing times may vary based on network conditions</li>
                  <li>Users are responsible for any blockchain transaction fees</li>
                </ul>

                <h3 className="text-lg font-semibold text-emerald-400">Wagering and Winnings</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>All machines require an initial setup fee in XLM</li>
                  <li>Winnings are distributed automatically via smart contracts</li>
                  <li>Platform fees may be deducted from winnings</li>
                  <li>Disputed matches will be reviewed by our team</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Using automated systems or bots to play matches</li>
                <li>Manipulating or attempting to manipulate match outcomes</li>
                <li>Creating multiple accounts to gain unfair advantages</li>
                <li>Engaging in any form of fraud or deceptive practices</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Risk Disclosure</h2>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-400 font-semibold mb-2">Important Risk Warning</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Cryptocurrency trading and fantasy leagues involve substantial risk of loss. Past performance does not guarantee future results. Only participate with funds you can afford to lose. The value of cryptocurrencies can be extremely volatile and unpredictable.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                Vend402 shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modifications to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use of the service after modifications constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
                <p className="text-emerald-400">Email: legal@vend402.so</p>
                <p className="text-emerald-400">Discord: Vend402 Community</p>
              </div>
            </section>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
