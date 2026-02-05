"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Twitter, Github, Send } from 'lucide-react'
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with technical issues",
      contact: "support@afl.so",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our community",
      contact: "Discord Server",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Twitter,
      title: "Social Media",
      description: "Follow us for updates",
      contact: "@AFL_so",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      icon: Github,
      title: "Open Source",
      description: "Contribute to our project",
      contact: "github.com/afl-so",
      color: "from-gray-400 to-gray-600"
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
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with our team - we're here to help!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <motion.div
                      key={method.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="glass-card rounded-xl p-6 hover:bg-gray-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{method.title}</h3>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                          <p className="text-emerald-400 font-medium">{method.contact}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
