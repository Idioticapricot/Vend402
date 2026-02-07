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
import { Plus, Copy, Check } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Vending Machines</h1>
              <p className="text-gray-300">Manage your smart contract vending machines ({machines.length} machines)</p>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Machine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Vending Machine</DialogTitle>
                  <DialogDescription>Deploy a new smart contract for your vending machine</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Product Price (XLM)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-400"
                    onClick={handleCreateMachine}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deploying Contract...
                      </>
                    ) : (
                      'Create Machine'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {machines.length === 0 ? (
            <Card className="glass-card border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No vending machines yet</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Create your first vending machine to start accepting ALGO payments
                </p>
                <Button className="bg-emerald-500 hover:bg-emerald-400" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Machine
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {machines.map((machine) => (
                <Card
                  key={machine.id}
                  className="glass-card border-gray-700 cursor-pointer hover:border-emerald-500/50 transition-colors"
                  onClick={() => router.push(`/machine/${machine.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">Machine #{machine.id.slice(-8)}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Created {new Date(machine.created_at).toLocaleDateString()} • {machine.price} XLM
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Payment Address (Merchant Wallet)</label>
                      <p className="text-sm font-mono text-gray-300 bg-gray-900/50 px-3 py-2 rounded mt-1 truncate">
                        {machine.machine_contract_address}
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-bold text-yellow-500">REQUIRED MEMO</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-yellow-400 font-mono font-bold tracking-wider">
                          {machine.id}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700 hover:bg-gray-800 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(machine.id)
                            toast.success("Memo copied!")
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        * Payments MUST include this Memo to credit this machine.
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm">API Key</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono truncate">
                          {machine.api_key}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700 hover:bg-gray-800 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyApiKey(machine.api_key, machine.id)
                          }}
                        >
                          {copiedId === machine.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
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