"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Book, Video, Users, ArrowRight } from 'lucide-react'

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of Vend402",
      articles: [
        "How to create your first portfolio",
        "Understanding Long vs Short strategies",
        "Setting up your wallet",
        "Making your first match"
      ]
    },
    {
      icon: Users,
      title: "Gameplay",
      description: "Master the game mechanics",
      articles: [
        "Portfolio allocation strategies",
        "Reading market data",
        "Tournament participation",
        "Ranking system explained"
      ]
    },
    {
      icon: MessageCircle,
      title: "Account & Wallet",
      description: "Manage your account and funds",
      articles: [
        "Connecting your Stellar wallet",
        "Depositing and withdrawing XLM",
        "Account security best practices",
        "Referral program guide"
      ]
    },
    {
      icon: Video,
      title: "Troubleshooting",
      description: "Common issues and solutions",
      articles: [
        "Connection problems",
        "Transaction failures",
        "Match disputes",
        "Technical support"
      ]
    }
  ]

  const faqs = [
    {
      question: "How does the fantasy league work?",
      answer: "Vend402 is a decentralized vending machine platform where you can manage machines and accept crypto payments."
    },
    {
      question: "What is the difference between Long and Short strategies?",
      answer: "Long strategy means you profit when your portfolio value increases. Short strategy means you profit when your portfolio value decreases. Choose based on your market prediction."
    },
    {
      question: "How are winnings calculated?",
      answer: "Winnings are based on your portfolio's performance relative to your opponent's. The better your portfolio performs according to your chosen strategy, the more you win."
    },
    {
      question: "Is my XLM safe?",
      answer: "Yes, all funds are secured using Stellar's blockchain technology. We use smart contracts to ensure fair play and automatic payouts."
    }
  ]

  return (
    <div className="min-h-screen stadium-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Book className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to your questions and learn how to master Vend402
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {helpCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card rounded-xl p-6 hover:bg-gray-800/60 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.articles.map((article, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 cursor-pointer">
                        <ArrowRight className="w-3 h-3" />
                        {article}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="border-b border-gray-700/50 pb-6 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="glass-card rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                Join Discord Community
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
