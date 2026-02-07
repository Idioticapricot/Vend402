"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { toast } from "sonner"
// import { Keypair } from '@stellar/stellar-sdk'

interface Machine {
  id: string
  api_key: string
  machine_contract_address: string
  created_at: string
  owner: {
    id: string
    email: string
    name: string | null
    wallet_address: string
  }
}

export default function MachinePage() {
  const params = useParams()
  const router = useRouter()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [contractBalance, setContractBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await fetch(`/api/machines/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setMachine(data.machine)
          // Fetch contract balance after machine data is loaded
          await fetchContractBalance(data.machine.machine_contract_address)
        } else {
          toast.error("Machine not found")
          router.push("/dashboard")
        }
      } catch (error) {
        toast.error("Failed to load machine")
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMachine()
    }
  }, [params.id, router])

  const fetchContractBalance = async (contractAddress: string) => {
    setBalanceLoading(true)
    try {
      // Mock balance for now as we transition to Stellar
      // In production, we would query Horizon for the account balance
      setContractBalance(100.0) // Mock 100 XLM
    } catch (error) {
      console.error('Error fetching contract balance:', error)
      toast.error('Failed to fetch contract balance')
    } finally {
      setBalanceLoading(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard`)

    setTimeout(() => {
      setCopiedField(null)
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

  if (!machine) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-700 hover:bg-gray-800 bg-transparent"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Machine #{machine.id.slice(-8)}
              </h1>
              <p className="text-gray-300">
                Created {new Date(machine.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Machine Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Configuration and credentials for your vending machine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Machine ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono">
                      {machine.id}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 hover:bg-gray-800 bg-transparent"
                      onClick={() => handleCopy(machine.id, "Machine ID")}
                    >
                      {copiedField === "Machine ID" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">API Key</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono">
                      {machine.api_key}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 hover:bg-gray-800 bg-transparent"
                      onClick={() => handleCopy(machine.api_key, "API Key")}
                    >
                      {copiedField === "API Key" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Contract Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono">
                      {machine.machine_contract_address}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 hover:bg-gray-800 bg-transparent"
                      onClick={() => handleCopy(machine.machine_contract_address, "Contract Address")}
                    >
                      {copiedField === "Contract Address" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contract Balance</CardTitle>
                <CardDescription className="text-gray-400">
                  Amount of XLM stored in the contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-gray-400 text-sm font-medium">Balance</label>
                  <div className="mt-1">
                    {balanceLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-300">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-emerald-400">
                        {contractBalance !== null ? `${contractBalance.toFixed(6)} XLM` : 'Failed to load'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Owner Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Details about the machine owner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Owner</label>
                  <p className="text-white mt-1">{machine.owner.name || machine.owner.email}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Wallet Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono">
                      {machine.owner.wallet_address}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 hover:bg-gray-800 bg-transparent"
                      onClick={() => handleCopy(machine.owner.wallet_address, "Wallet Address")}
                    >
                      {copiedField === "Wallet Address" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}