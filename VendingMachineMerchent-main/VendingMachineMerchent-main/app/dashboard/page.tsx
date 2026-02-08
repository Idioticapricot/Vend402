"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Copy, Check, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface Machine {
  id: string
  api_key: string
  machine_contract_address: string
  price: number
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [machines, setMachines] = useState<Machine[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [price, setPrice] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
        return
      }

      setUser(session.user)

      // Get user from database
      let userResponse = await fetch(`/api/user?email=${session.user.email}`)
      let userData = await userResponse.json()

      if (!userData.user) {
        // Create user only if doesn't exist
        userResponse = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session.user })
        })
        userData = await userResponse.json()
      }


      if (!userData.user) {
        console.error("Failed to load or create user", userData)
        toast.error("Failed to initialize user account")
        setLoading(false)
        return
      }

      setDbUser(userData.user)

      // Load machines
      const machinesResponse = await fetch(`/api/machines?ownerId=${userData.user.id}`)
      const machinesData = await machinesResponse.json()
      setMachines(machinesData.machines || [])

      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleCreateMachine = async () => {
    if (!dbUser) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId: dbUser.id, price: parseFloat(price) || 0.0 })
      })

      const data = await response.json()

      if (response.ok) {
        setMachines([data.machine, ...machines])
        toast.success("Machine registered successfully!")
        setIsCreateModalOpen(false)
        setPrice('')
      } else {
        toast.error(data.error || "Failed to deploy smart contract")
      }
    } catch (error) {
      toast.error("Failed to deploy smart contract")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyApiKey = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey)
    setCopiedId(id)
    toast.success("API key copied to clipboard")

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1121] text-slate-200">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-200">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800/60">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Your Vending Machines</h1>
              <p className="text-slate-400">Manage your fleet and payment configurations</p>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Machine
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">New Vending Machine</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Register a new device to start accepting Stellar XLM payments.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Product Price (XLM)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-3 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-lg"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm pointer-events-none">
                        XLM
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                    size="lg"
                    onClick={handleCreateMachine}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Register Machine'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {machines.length === 0 ? (
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-xl">
              <CardContent className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700">
                  <Plus className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No machines configured</h3>
                <p className="text-slate-400 mb-8 text-center max-w-sm">
                  Register your first vending machine to generate a Machine ID and start accepting payments.
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {machines.map((machine) => (
                <Card
                  key={machine.id}
                  className="bg-slate-900/40 border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all group shadow-lg"
                >
                  <CardHeader className="border-b border-slate-800/60 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Machine #{machine.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="text-slate-500 mt-1 flex items-center gap-2">
                          <span>Date: {new Date(machine.created_at).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-slate-600 rounded-full" />
                          <span className="text-slate-300 font-medium">{machine.price} XLM</span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 border border-slate-700 hover:border-emerald-500/30 transition-all"
                        onClick={() => router.push(`/machine/${machine.id}`)}
                      >
                        Analytics <ArrowRight className="w-3 h-3 ml-2 opacity-60" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-5">

                    {/* ID */}
                    <div className="group/field">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Machine ID (Memo)</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 group-hover/field:border-slate-700 transition-colors">
                          <code className="text-sm text-amber-400 font-mono font-bold truncate block">
                            {machine.id}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800"
                          onClick={() => {
                            navigator.clipboard.writeText(machine.id)
                            toast.success("Machine ID copied!")
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="group/field">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 group-hover/field:border-slate-700 transition-colors">
                          <code className="text-xs text-slate-300 font-mono truncate block">
                            {machine.api_key}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800"
                          onClick={() => handleCopyApiKey(machine.api_key, machine.id)}
                        >
                          {copiedId === machine.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Wallet (Collapsed View) */}
                    <div className="pt-2 border-t border-slate-800/60 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Receiving Wallet</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                            {machine.machine_contract_address || "Not Set"}
                          </span>
                          <button
                            onClick={() => {
                              if (machine.machine_contract_address) {
                                navigator.clipboard.writeText(machine.machine_contract_address)
                                toast.success("Wallet address copied!")
                              }
                            }}
                            className="text-slate-500 hover:text-emerald-400 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}