/**
 * Vend402 - Supabase Edge Function: HTTP 402 Payment Gatekeeper
 * Handles payment challenges, verification, and dispense triggering for Stellar vending machines
 *
 * Deploy to: supabase/functions/vend402-gatekeeper/index.ts
 * Environment variables required:
 *   - VEND402_MERCHANT_ACCOUNT: Stellar public key receiving payments
 *   - VEND402_HORIZON_URL: Horizon API endpoint
 *   - VEND402_NETWORK: "stellar-testnet" or "stellar-mainnet"
 *   - VEND402_HMAC_SECRET: (optional) for challenge signing
 *
 * @version 1.0.0
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts"

// Types
interface Vend402Challenge {
  vend402: true
  challengeId: string
  amount: string
  asset: "XLM"
  destination: string
  memo: string
  expiresAt: string
  ledgerExpiry: number
  message?: string
}

interface Vend402PaymentRequest {
  deviceId: string
  txHash: string
  action: "getChallenge" | "verifyPayment"
  clientId?: string
  challengeId?: string
}

interface Vend402VerificationSuccess {
  success: true
  message: string
  txHash: string
  dispensed: boolean
}

interface Vend402VerificationFailure {
  success: false
  code: string
  message: string
}

type Vend402VerificationResponse = Vend402VerificationSuccess | Vend402VerificationFailure

// Environment
const MERCHANT_ACCOUNT = Deno.env.get("VEND402_MERCHANT_ACCOUNT") || ""
const HORIZON_URL = Deno.env.get("VEND402_HORIZON_URL") || "https://horizon-testnet.stellar.org"
const NETWORK = (Deno.env.get("VEND402_NETWORK") || "stellar-testnet") as "stellar-testnet" | "stellar-mainnet"
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

// Initialize Supabase client (with service role for admin operations)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/**
 * Main handler for Vend402 gatekeeper requests
 */
serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  try {
    // Validate request method
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405)
    }

    // Parse request body
    const body = await req.json()
    const { action, deviceId, txHash, clientId, challengeId } = body as Vend402PaymentRequest

    // Validate required fields
    if (!deviceId) {
      return jsonResponse({ error: "deviceId is required" }, 400)
    }

    // Route based on action
    if (action === "getChallenge") {
      return handleGetChallenge(deviceId)
    } else if (action === "verifyPayment") {
      if (!txHash) {
        return jsonResponse({ error: "txHash is required for verification" }, 400)
      }
      return handleVerifyPayment(deviceId, txHash, challengeId)
    } else {
      return jsonResponse({ error: "Invalid action" }, 400)
    }
  } catch (error) {
    console.error("[Vend402] Unhandled error:", error)
    return jsonResponse(
      {
        success: false,
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
})

/**
 * Handle challenge request (initiate payment flow)
 */
async function handleGetChallenge(deviceId: string): Promise<Response> {
  try {
    // Look up machine in database
    const { data: machine, error: machineError } = await supabase
      .from("machines")
      .select("id, price, api_key, owner_id")
      .eq("id", deviceId)
      .single()

    if (machineError || !machine) {
      return jsonResponse({ error: "Machine not found" }, 404)
    }

    // Create challenge
    const challengeId = nanoid(16)
    const amount = String(Math.floor((machine.price || 0.1) * 10_000_000)) // Convert XLM to stroops
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString() // 10 minutes

    // Store challenge in database for verification later
    const { error: storeError } = await supabase.from("vend402_challenges").insert({
      challenge_id: challengeId,
      device_id: deviceId,
      amount,
      destination: MERCHANT_ACCOUNT,
      memo: challengeId,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    })

    if (storeError) {
      console.error("[Vend402] Failed to store challenge:", storeError)
      // Continue anyway, we can validate on verification
    }

    const challenge: Vend402Challenge = {
      vend402: true,
      challengeId,
      amount,
      asset: "XLM",
      destination: MERCHANT_ACCOUNT,
      memo: challengeId,
      expiresAt,
      ledgerExpiry: 0, // Would be set by Horizon ledger check if needed
      message: `Pay ${(Number(amount) / 10_000_000).toFixed(2)} XLM to dispense item`,
    }

    // Return 402 Payment Required with challenge
    return jsonResponse(challenge, 402)
  } catch (error) {
    console.error("[Vend402] Error in getChallenge:", error)
    return jsonResponse({ error: "Failed to generate challenge" }, 500)
  }
}

/**
 * Handle payment verification (after user signs and submits tx hash)
 */
async function handleVerifyPayment(deviceId: string, txHash: string, challengeId?: string): Promise<Response> {
  try {
    // Validate transaction hash format (hex string, 64 chars)
    if (!/^[a-f0-9]{64}$/i.test(txHash)) {
      return jsonResponse(
        {
          success: false,
          code: "INVALID_TRANSACTION",
          message: "Invalid transaction hash format",
        },
        400,
      )
    }

    // Fetch transaction from Horizon
    console.log(`[Vend402] Fetching transaction ${txHash} from Horizon...`)
    const txnResponse = await fetch(`${HORIZON_URL}/transactions/${txHash}`)

    if (!txnResponse.ok) {
      if (txnResponse.status === 404) {
        return jsonResponse(
          {
            success: false,
            code: "TRANSACTION_NOT_FOUND",
            message: "Transaction not found on Stellar network",
          },
          400,
        )
      }
      throw new Error(`Horizon error: ${txnResponse.statusText}`)
    }

    const txn = await txnResponse.json()

    // Validate transaction properties
    const validation = validateTransaction(txn, deviceId, challengeId)
    if (!validation.valid) {
      return jsonResponse(
        {
          success: false,
          code: validation.code,
          message: validation.message,
        },
        400,
      )
    }

    // Check for duplicate payment
    const { data: existing } = await supabase
      .from("vend402_payments")
      .select("id")
      .eq("tx_hash", txHash)
      .eq("status", "verified")
      .limit(1)

    if (existing && existing.length > 0) {
      return jsonResponse(
        {
          success: false,
          code: "DUPLICATE_PAYMENT",
          message: "This transaction has already been used",
        },
        400,
      )
    }

    // Record payment in database
    const { error: insertError } = await supabase.from("vend402_payments").insert({
      challenge_id: challengeId || txn.memo,
      device_id: deviceId,
      amount: String(txn.operations[0]?.amount * 10_000_000 || 0),
      asset: "XLM",
      tx_hash: txHash,
      status: "verified",
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[Vend402] Failed to record payment:", insertError)
      // Continue - payment is still valid
    }

    // Trigger dispense via Supabase Realtime
    try {
      console.log(`[Vend402] Broadcasting dispense event for device ${deviceId}...`)
      const channel = supabase.channel(`machine-${deviceId}`)
      await channel.send({
        type: "broadcast",
        event: "vend402_dispense",
        payload: {
          txHash,
          challengeId: challengeId || txn.memo,
          timestamp: new Date().toISOString(),
        },
      })
      channel.unsubscribe()
    } catch (broadcastError) {
      console.error("[Vend402] Broadcast error (non-fatal):", broadcastError)
      // Non-fatal - payment is verified, dispense signal may be lost
    }

    // Return success
    return jsonResponse({
      success: true,
      message: "Payment verified successfully. Dispensing item...",
      txHash,
      dispensed: true,
    })
  } catch (error) {
    console.error("[Vend402] Error in verifyPayment:", error)
    return jsonResponse(
      {
        success: false,
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Verification failed",
      },
      500,
    )
  }
}

/**
 * Validate Horizon transaction against payment requirements
 */
function validateTransaction(
  txn: any,
  deviceId: string,
  expectedMemo?: string,
): { valid: boolean; code?: string; message?: string } {
  try {
    // Check transaction is successful
    if (!txn.successful) {
      return { valid: false, code: "INVALID_TRANSACTION", message: "Transaction failed on network" }
    }

    // Check has operations
    if (!txn.operations || txn.operations.length === 0) {
      return { valid: false, code: "INVALID_TRANSACTION", message: "Transaction has no operations" }
    }

    // Find payment operation
    const paymentOp = txn.operations.find((op: any) => op.type === "payment")
    if (!paymentOp) {
      return { valid: false, code: "INVALID_TRANSACTION", message: "No payment operation found" }
    }

    // Check destination is merchant account
    if (paymentOp.to !== MERCHANT_ACCOUNT) {
      return { valid: false, code: "WRONG_DESTINATION", message: "Payment sent to wrong account" }
    }

    // Check asset is XLM (native)
    if (paymentOp.asset_type !== "native") {
      return { valid: false, code: "WRONG_ASSET", message: "Payment must be in XLM" }
    }

    // Check memo matches (if expected)
    if (expectedMemo && txn.memo !== expectedMemo) {
      return { valid: false, code: "INVALID_MEMO", message: "Transaction memo does not match challenge" }
    }

    // Amount validation would go here (comparing against machine.price)
    // For now, we accept any amount > 0
    if (Number(paymentOp.amount) <= 0) {
      return { valid: false, code: "INSUFFICIENT_AMOUNT", message: "Payment amount must be greater than zero" }
    }

    // All checks passed
    return { valid: true }
  } catch (error) {
    console.error("[Vend402] Validation error:", error)
    return { valid: false, code: "UNKNOWN_ERROR", message: "Validation check failed" }
  }
}

/**
 * Helper: Send JSON response with CORS headers
 */
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
