"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"

export default function StellarVendingMachine() {
  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none opacity-30" />

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  )
}
