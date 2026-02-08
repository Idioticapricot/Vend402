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
      <div className="min-h-screen bg-[#0B1121] text-slate-200">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!machine) return null

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-200">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/60">
            <div>
              <Button
                variant="link"
                className="mb-2 pl-0 text-emerald-400 hover:text-emerald-300 transition-colors"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                Machine Analytics
              </h1>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="font-mono bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-md text-xs text-emerald-500">
                  ID: {machine.id.slice(-8)}
                </span>
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <span className="text-sm font-medium">{machine.price} XLM / Item</span>
              </div>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-5">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Revenue</p>
                  <div className="text-3xl font-bold text-white tabular-nums flex items-baseline gap-1">
                    {totalRevenue.toFixed(2)} <span className="text-sm font-medium text-emerald-500">XLM</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-5">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Transactions</p>
                  <div className="text-3xl font-bold text-white tabular-nums flex items-baseline gap-1">
                    {totalTx} <span className="text-sm font-medium text-slate-500">txs</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Charts & History */}
            <div className="lg:col-span-2 space-y-8">

              {/* Sales Chart */}
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Sales Volume <span className="text-slate-500 font-normal text-sm ml-auto">Last 7 Days</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] w-full pt-4">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#64748B"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#64748B"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                                  <p className="text-slate-400 text-xs mb-1">{label}</p>
                                  <p className="text-emerald-400 font-bold text-lg">
                                    {payload[0].value} XLM
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                          cursor={{ fill: '#1E293B', opacity: 0.4 }}
                        />
                        <Bar
                          dataKey="amount"
                          fill="url(#colorAmount)"
                          radius={[6, 6, 0, 0]}
                          barSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                      <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                        <Activity className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="font-medium">No sales data recorded yet</p>
                      <p className="text-sm mt-1">Transactions will appear here once processed.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-800/60 pb-4">
                  <CardTitle className="text-lg font-semibold text-white">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4 font-semibold tracking-wider">Time</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Amount</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                                <span className="block font-medium text-white">
                                  {new Date(tx.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-emerald-400 tabular-nums">
                                +{tx.amount} <span className="text-emerald-600/70 text-xs ml-0.5">XLM</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tx.status === 'success' || tx.status === 'verified'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]'
                                  : tx.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}>
                                  {tx.status === 'success' || tx.status === 'verified' ? (
                                    <Check className="w-3 h-3 mr-1" />
                                  ) : null}
                                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <a
                                  href={`https://stellar.expert/explorer/testnet/tx/${tx.tx_hash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors hover:underline decoration-slate-600 underline-offset-4"
                                >
                                  View on Chain
                                  <ArrowLeft className="w-3 h-3 ml-1 rotate-[135deg]" />
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                              No transactions found for this machine.
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
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-xl h-fit sticky top-6">
                <CardHeader className="border-b border-slate-800/60 pb-4">
                  <CardTitle className="text-lg font-semibold text-white">Connection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Machine ID */}
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Machine ID (Required Memo)
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-lg group-hover:border-slate-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <code className="block w-full px-2 text-sm text-amber-400 font-mono font-bold truncate">
                          {machine.id}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(machine.id, "Machine ID")}
                      >
                        {copiedField === "Machine ID" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 ml-1">
                      Always include this ID as the Memo when sending payments.
                    </p>
                  </div>

                  {/* Wallet Address */}
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Receiving Wallet
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-lg group-hover:border-slate-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <code className="block w-full px-2 text-xs text-slate-300 font-mono truncate">
                          {machine.machine_contract_address || "Not Set"}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
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
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      API Key
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-lg group-hover:border-slate-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <code className="block w-full px-2 text-xs text-slate-300 font-mono truncate">
                          {machine.api_key}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(machine.api_key, "API Key")}
                      >
                        {copiedField === "API Key" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-400">i</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-indigo-300">Integration Tip</h4>
                        <p className="text-xs text-indigo-200/70 mt-1 leading-relaxed">
                          Use the API Key to fetch this machine's config from your hardware device to get the correct price and wallet address automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}