"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, TrendingUp, DollarSign, Activity } from "lucide-react"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Machine {
  id: string
  api_key: string
  machine_contract_address: string
  created_at: string
  price: number
  owner: {
    id: string
    email: string
    name: string | null
    wallet_address: string
  }
}

interface Transaction {
  id: string
  amount: string
  asset: string
  tx_hash: string
  status: string
  created_at: string
  payer?: string
}

export default function MachinePage() {
  const params = useParams()
  const router = useRouter()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Computed stats
  const totalRevenue = transactions
    .filter(t => t.status === 'success' || t.status === 'verified')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)

  const totalTx = transactions.length

  // Format data for chart (group by date)
  const chartData = transactions
    .reduce((acc: any[], t) => {
      const date = new Date(t.created_at).toLocaleDateString()
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.amount += parseFloat(t.amount || '0')
      } else {
        acc.push({ date, amount: parseFloat(t.amount || '0') })
      }
      return acc
    }, [])
    .slice(-7) // Last 7 days with activity

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch machine
        const machineRes = await fetch(`/api/machines/${params.id}`)
        const machineData = await machineRes.json()

        if (machineRes.ok) {
          setMachine(machineData.machine)
        } else {
          toast.error("Machine not found")
          router.push("/dashboard")
          return
        }

        // Fetch transactions
        const txRes = await fetch(`/api/machines/${params.id}/transactions`)
        const txData = await txRes.json()
        if (txRes.ok) {
          setTransactions(txData.transactions || [])
        }

      } catch (error) {
        toast.error("Failed to load data")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard`)
    setTimeout(() => setCopiedField(null), 2000)
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

  if (!machine) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                className="mb-2 pl-0 text-emerald-300 hover:text-emerald-200"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-white">Machine Analytics</h1>
              <div className="flex items-center gap-2 text-gray-300 mt-1">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-sm">#{machine.id.slice(-8)}</span>
                <span>•</span>
                <span>{machine.price} XLM per item</span>
              </div>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
              <Card className="bg-slate-800/50 border-emerald-500/20">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total Revenue</p>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center">
                    {totalRevenue.toFixed(2)} XLM
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-emerald-500/20">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Transactions</p>
                  <div className="text-2xl font-bold text-white mt-1 flex items-center">
                    <Activity className="w-4 h-4 mr-1 text-blue-400" />
                    {totalTx}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Charts & History */}
            <div className="lg:col-span-2 space-y-8">

              {/* Sales Chart */}
              <Card className="glass-card border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Sales Volume (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                          itemStyle={{ color: '#34D399' }}
                          cursor={{ fill: '#374151', opacity: 0.4 }}
                        />
                        <Bar dataKey="amount" fill="#34D399" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Activity className="w-8 h-8 mb-2 opacity-50" />
                      <p>No sales data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="glass-card border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                        <tr>
                          <th className="px-4 py-3">Time</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-gray-300">
                                {new Date(tx.created_at).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 font-medium text-emerald-400">
                                +{tx.amount} {tx.asset || 'XLM'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${tx.status === 'success' || tx.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                                  tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <a
                                  href={`https://testnet.stellarchain.io/transactions/${tx.tx_hash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                  View on Chain
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Machine Details */}
            <div className="space-y-6">
              <Card className="glass-card border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Machine ID */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Machine ID (Memo)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-900 px-3 py-2 rounded text-sm text-yellow-500 font-mono font-bold truncate">
                        {machine.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => handleCopy(machine.id, "Machine ID")}
                      >
                        {copiedField === "Machine ID" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Receiving Wallet</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-900 px-3 py-2 rounded text-xs text-gray-400 font-mono truncate">
                        {machine.machine_contract_address || "Not Set"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          if (machine.machine_contract_address) {
                            handleCopy(machine.machine_contract_address, "Wallet")
                          }
                        }}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">API Key</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-slate-900 px-3 py-2 rounded text-xs text-gray-400 font-mono truncate">
                        {machine.api_key}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => handleCopy(machine.api_key, "API Key")}
                      >
                        {copiedField === "API Key" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-indigo-300 mb-2">Pro Tip</h3>
                  <p className="text-sm text-indigo-100/80">
                    Use the <strong>Machine ID</strong> as the MEMO for all recurring payments to ensure they are tracked correctly in this dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}