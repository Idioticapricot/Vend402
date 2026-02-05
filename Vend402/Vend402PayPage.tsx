/**
 * Vend402PayPage - React component for handling Vend402 payments
 * Replaces the existing Algorand pay page flow with Stellar X402 payment
 *
 * Usage:
 * - Deploy alongside existing NextJS app
 * - Route: app/pay/vend402/[machine-id]/page.tsx
 * - Handles: 402 challenges, Freighter signing, verification, dispense
 *
 * @component
 * @version 1.0.0
 */

"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ChevronLeft, HelpCircle, AlertCircle, CheckCircle2, Loader2, QrCode } from "lucide-react"
import Link from "next/link"
import { createVend402Client, isFreighterAvailable, formatXLM } from "@/lib/vend402-client"
import type { Vend402Challenge, Vend402VerificationResponse } from "@/lib/vend402-types"

/**
 * Machine details from database
 */
interface MachineDetails {
  id: string
  price: number
  api_key: string
  owner_id: string
}

/**
 * Payment flow states
 */
type PaymentState = "idle" | "requesting_challenge" | "challenge_received" | "signing" | "submitting" | "verifying" | "success" | "error"

export default function Vend402PayPage() {
  const router = useRouter()
  const params = useParams()
  const machineId = params["machine-id"] as string

  // UI State
  const [state, setState] = useState<PaymentState>("idle")
  const [machineDetails, setMachineDetails] = useState<MachineDetails | null>(null)
  const [challenge, setChallenge] = useState<Vend402Challenge | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isFreighter, setIsFreighter] = useState(false)

  // Vend402 client
  const vend402Client = createVend402Client({
    gatekeeperUrl: "/api/vend402-gatekeeper",
    network: "stellar-testnet",
  })

  /**
   * Load machine details on mount
   */
  useEffect(() => {
    const loadMachine = async () => {
      try {
        // For now, simulate machine loading
        // In real app, fetch from your API or Supabase
        setMachineDetails({
          id: machineId,
          price: 0.5, // Default price
          api_key: "demo-key",
          owner_id: "owner-1",
        })

        // Check Freighter availability
        setIsFreighter(isFreighterAvailable())
      } catch (err) {
        setError("Failed to load machine details")
        console.error("Machine load error:", err)
      }
    }

    if (machineId) {
      loadMachine()
    }
  }, [machineId])

  /**
   * Listen for dispense event via Supabase Realtime
   */
  useEffect(() => {
    if (state !== "verifying" && state !== "success") return

    const timer = setTimeout(() => {
      // In real app with Supabase:
      // const channel = supabase.channel(`machine-${machineId}`)
      // channel.on('broadcast', { event: 'vend402_dispense' }, (payload) => {
      //   console.log("[Vend402] Dispense event received:", payload)
      //   setState("success")
      // })
      // For now, just mark as success after verification
      if (state === "verifying") {
        setState("success")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [state, machineId])

  /**
   * Step 1: Request payment challenge from gatekeeper
   */
  const handleRequestChallenge = useCallback(async () => {
    if (!machineDetails) return

    try {
      setState("requesting_challenge")
      setError(null)

      console.log("[Vend402] Requesting challenge for device:", machineId)
      const receivedChallenge = await vend402Client.requestChallenge(machineId)

      setChallenge(receivedChallenge)
      setState("challenge_received")
      console.log("[Vend402] Challenge received:", receivedChallenge)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to request challenge"
      setError(message)
      setState("error")
      console.error("[Vend402] Challenge request error:", err)
    }
  }, [machineId, machineDetails, vend402Client])

  /**
   * Step 2: Sign payment with Freighter wallet
   */
  const handleSignWithFreighter = useCallback(async () => {
    if (!challenge) return

    try {
      setState("signing")
      setError(null)

      console.log("[Vend402] Requesting Freighter signature...")
      const signedXdr = await vend402Client.signWithFreighter(challenge)

      console.log("[Vend402] Freighter signed, submitting to Horizon...")
      setState("submitting")

      const horizonUrl = "https://horizon-testnet.stellar.org"
      const txHashResult = await vend402Client.submitPayment(machineId, signedXdr, horizonUrl)

      setTxHash(txHashResult)
      console.log("[Vend402] Transaction submitted, hash:", txHashResult)

      // Step 3: Verify payment with gatekeeper
      setState("verifying")
      const verification = await vend402Client.verifyPayment(machineId, txHashResult)

      if (verification.success) {
        console.log("[Vend402] Payment verified, machine should dispense")
        setState("success")
      } else {
        setError(verification.message)
        setState("error")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed"
      setError(message)
      setState("error")
      console.error("[Vend402] Payment error:", err)
    }
  }, [challenge, machineId, vend402Client])

  /**
   * Render: Initial state (no challenge yet)
   */
  if (state === "idle" || state === "requesting_challenge") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black py-8 px-4">
        <div className="flex justify-between items-center mb-8 px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-white">Vend402 Payment</h1>
          <Link href="/help" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <HelpCircle size={20} />
          </Link>
        </div>

        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card className="bg-slate-800 border-purple-500/20 p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Pay with Stellar</h2>
                <p className="text-gray-400 text-sm">Using X402 Payment Protocol</p>
              </div>

              {machineDetails && (
                <>
                  <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-purple-500/30">
                    <p className="text-gray-300 text-sm text-center">
                      Machine: <span className="text-purple-400 font-bold">{machineDetails.id}</span>
                    </p>
                    <p className="text-gray-300 text-sm text-center mt-2">
                      Price: <span className="text-purple-400 font-bold">{machineDetails.price} XLM</span>
                    </p>
                  </div>

                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      ℹ️ <span className="font-semibold">Fast, gasless payments on Stellar</span>
                    </p>
                    <p className="text-blue-300 text-xs mt-2">Settlement in 2-5 seconds. No hidden fees.</p>
                  </div>

                  <Button
                    onClick={handleRequestChallenge}
                    disabled={state === "requesting_challenge"}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg"
                  >
                    {state === "requesting_challenge" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing payment...
                      </>
                    ) : (
                      "Initiate Payment"
                    )}
                  </Button>

                  {!isFreighter && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-300 text-xs">
                        ⚠️ <strong>Freighter wallet not detected.</strong> Please install the Freighter wallet extension
                        from{" "}
                        <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="underline">
                          freighter.app
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  /**
   * Render: Challenge received, waiting for signature
   */
  if (state === "challenge_received" && challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black py-8 px-4">
        <div className="flex justify-between items-center mb-8 px-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-white">Approve Payment</h1>
          <div className="w-6" />
        </div>

        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card className="bg-slate-800 border-purple-500/20 p-8 w-full max-w-md">
              <div className="text-center mb-6">
                <QrCode className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white">Confirm in Wallet</h2>
                <p className="text-gray-400 text-sm mt-2">Freighter will open with payment details</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-purple-500/30 space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Amount</p>
                  <p className="text-white text-lg font-bold">{formatXLM(challenge.amount)} XLM</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">To</p>
                  <p className="text-white text-sm font-mono break-all">{challenge.destination}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Memo</p>
                  <p className="text-white text-sm font-mono">{challenge.memo}</p>
                </div>
              </div>

              <Button
                onClick={handleSignWithFreighter}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg"
              >
                Open Freighter
              </Button>

              <p className="text-gray-500 text-xs text-center mt-4">
                Your private keys never leave Freighter. Transaction is signed locally on your device.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  /**
   * Render: Processing states (signing, submitting, verifying)
   */
  if (state === "signing" || state === "submitting" || state === "verifying") {
    const stateMessages = {
      signing: {
        title: "Signing Transaction",
        subtitle: "Waiting for Freighter confirmation...",
      },
      submitting: {
        title: "Submitting to Stellar",
        subtitle: "Broadcasting transaction to the network...",
      },
      verifying: {
        title: "Verifying Payment",
        subtitle: "Confirming transaction with merchant...",
      },
    }

    const msg = stateMessages[state]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <Card className="bg-slate-800 border-purple-500/20 p-12 w-full max-w-md text-center">
              <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">{msg.title}</h2>
              <p className="text-gray-400">{msg.subtitle}</p>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  /**
   * Render: Success state
   */
  if (state === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card className="bg-slate-800 border-green-500/20 p-8 w-full max-w-md">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-4">Your item is being dispensed...</p>

                {txHash && (
                  <div className="bg-slate-900 rounded-lg p-3 mb-6 border border-green-500/20">
                    <p className="text-gray-500 text-xs uppercase mb-1">Transaction ID</p>
                    <p className="text-green-400 text-xs font-mono break-all">{txHash}</p>
                  </div>
                )}

                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg"
                >
                  Return Home
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  /**
   * Render: Error state
   */
  if (state === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <Card className="bg-slate-800 border-red-500/20 p-8 w-full max-w-md">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                <p className="text-red-300 mb-6">{error || "An error occurred"}</p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setState("idle")
                      setError(null)
                      setChallenge(null)
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:bg-slate-700"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}
