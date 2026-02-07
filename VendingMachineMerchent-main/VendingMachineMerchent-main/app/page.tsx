"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"

export default function StellarVendingMachine() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800 relative overflow-hidden stadium-bg">
      {/* Stadium Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/50" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-800/40 to-transparent" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  )
}
