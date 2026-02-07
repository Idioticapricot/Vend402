/**
 * Vend402 - X402 Payment Protocol for Stellar
 * Client-side utilities for handling payment challenges and Freighter integration
 *
 * @module vend402-client
 * @version 1.0.0
 */

import { isConnected, signTransaction, getAddress, requestAccess } from "@stellar/freighter-api"
import { Keypair, Networks, TransactionBuilder, BASE_FEE, Operation, Memo, Asset, Account } from "@stellar/stellar-sdk"
import type { Vend402Challenge, Vend402PaymentRequest, Vend402VerificationResponse } from "./vend402-types"

/**
 * Vend402Client - Main class for handling Vend402 payment flows
 * Supports both Freighter wallet and keypair-based signing
 */
export class Vend402Client {
  private gatekeeperUrl: string
  private network: "stellar-testnet" | "stellar-mainnet"

  /**
   * Initialize Vend402Client
   * @param gatekeeperUrl - URL of the Vend402 gatekeeper endpoint
   * @param network - Stellar network to use
   */
  constructor(
    gatekeeperUrl: string = "/api/vend402-gatekeeper",
    network: "stellar-testnet" | "stellar-mainnet" = "stellar-testnet",
  ) {
    this.gatekeeperUrl = gatekeeperUrl
    this.network = network
  }

  /**
   * Request a payment challenge from the gatekeeper
   * (Initiates the 402 payment flow)
   */
  async requestChallenge(deviceId: string): Promise<Vend402Challenge> {
    const response = await fetch(this.gatekeeperUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, action: "getChallenge" }),
    })

    if (response.status === 402) {
      // 402 Payment Required - contains challenge
      const data = await response.json()
      if (data.vend402) {
        return data as Vend402Challenge
      }
      throw new Error(`Invalid challenge response: ${JSON.stringify(data)}`)
    }

    if (!response.ok) {
      const error = await response.json()
      // Handle both standard error format and our debug format
      const msg = error.message || error.error || JSON.stringify(error)
      throw new Error(`Failed to request challenge: ${msg}`)
    }

    const data = await response.json()
    return data as Vend402Challenge
  }

  /**
   * Create a Stellar URI for SEP-7 deeplink into Freighter
   * Follows the Stellar web+ protocol: https://github.com/stellar/stellar-protocol/blob/master/core/cap-0007.md
   */
  createStellarUri(challenge: Vend402Challenge): string {
    const params = new URLSearchParams({
      destination: challenge.destination,
      amount: this.stroopsToXlm(challenge.amount),
      memo: challenge.memo,
      memo_type: "text",
      callback: "post",
    })

    return `web+stellar:pay?${params.toString()}`
  }

  /**
   * Generate a friendly URL that opens in Freighter if installed
   * For wallets that support deep linking
   */
  createFreighterDeeplink(challenge: Vend402Challenge): string {
    // Freighter doesn't have standard deeplinks, but we can use stellar-uri
    return this.createStellarUri(challenge)
  }

  /**
   * Sign a payment transaction with Freighter wallet
   * Assumes Freighter is installed and user has accounts
   */
  async signWithFreighter(challenge: Vend402Challenge): Promise<string> {
    // Check if Freighter is available
    const connected = await isConnected()
    if (!connected) {
      throw new Error("Freighter wallet not found. Please install it from https://freighter.app")
    }

    try {
      // Build a simple payment transaction
      let { address } = await getAddress()

      if (!address) {
        // Prepare to request access if not already granted
        const accessObj = await requestAccess()
        if (accessObj.error) {
          throw new Error("Freighter access denied: " + accessObj.error)
        }
        address = accessObj.address
      }

      if (!address) {
        throw new Error("No public key selected in Freighter. Please unlock Freighter and allow access.")
      }

      const sourceAccount = await this.getAccountFromHorizon(address)

      const txn = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network === "stellar-testnet" ? Networks.TESTNET : Networks.PUBLIC,
      })
        .addOperation(
          Operation.payment({
            destination: challenge.destination,
            amount: this.stroopsToXlm(challenge.amount),
            asset: Asset.native(),
          }),
        )
        .addMemo(Memo.text(challenge.memo))
        .setTimeout(30)
        .build()

      // Request Freighter to sign
      const signed = await signTransaction(txn.toXDR(), {
        networkPassphrase: this.network === "stellar-testnet" ? Networks.TESTNET : Networks.PUBLIC,
      })

      if (signed.error) {
        throw new Error(signed.error)
      }
      return signed.signedTxXdr
    } catch (error) {
      throw new Error(`Freighter signing failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Sign a payment transaction with a keypair (backend/script usage)
   */
  async signWithKeypair(challenge: Vend402Challenge, keypair: Keypair): Promise<string> {
    const sourceAccount = await this.getAccountFromHorizon(keypair.publicKey())

    const txn = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: this.network === "stellar-testnet" ? Networks.TESTNET : Networks.PUBLIC,
    })
      .addOperation(
        Operation.payment({
          destination: challenge.destination,
          amount: this.stroopsToXlm(challenge.amount),
          asset: Asset.native(),
        }),
      )
      .addMemo(Memo.text(challenge.memo))
      .setTimeout(30)
      .build()

    txn.sign(keypair)
    return txn.toXDR()
  }

  /**
   * Submit signed transaction to Horizon and verify with gatekeeper
   */
  async submitPayment(
    deviceId: string,
    signedTxXdr: string,
    horizonUrl: string = "https://horizon-testnet.stellar.org",
  ): Promise<string> {
    // Submit transaction to Horizon
    const submitResponse = await fetch(`${horizonUrl}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ tx: signedTxXdr }).toString(),
    })

    const submitData = await submitResponse.json()
    if (!submitResponse.ok) {
      throw new Error(`Transaction submission failed: ${submitData.title}`)
    }

    const txHash = submitData.hash
    return txHash
  }

  /**
   * Verify payment with gatekeeper using transaction hash
   */
  async verifyPayment(deviceId: string, txHash: string): Promise<Vend402VerificationResponse> {
    const request: Vend402PaymentRequest = {
      deviceId,
      txHash,
    }

    const response = await fetch(this.gatekeeperUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, action: "verifyPayment" }),
    })

    const data = await response.json()
    return data as Vend402VerificationResponse
  }

  /**
   * Full payment flow: request challenge → sign with Freighter → submit → verify
   */
  async executePaymentFlow(deviceId: string, useFreighter: boolean = true): Promise<Vend402VerificationResponse> {
    // Step 1: Get challenge
    console.log("[Vend402] Requesting payment challenge...")
    const challenge = await this.requestChallenge(deviceId)
    console.log("[Vend402] Challenge received:", challenge)

    // Step 2: Sign with wallet
    console.log("[Vend402] Requesting wallet signature...")
    let signedXdr: string
    if (useFreighter) {
      signedXdr = await this.signWithFreighter(challenge)
    } else {
      throw new Error("Non-Freighter signing requires explicit keypair")
    }
    console.log("[Vend402] Transaction signed")

    // Step 3: Submit to Horizon
    console.log("[Vend402] Submitting transaction to Stellar network...")
    const horizonUrl = this.network === "stellar-testnet" ? "https://horizon-testnet.stellar.org" : "https://horizon.stellar.org"
    const txHash = await this.submitPayment(deviceId, signedXdr, horizonUrl)
    console.log("[Vend402] Transaction submitted, hash:", txHash)

    // Step 4: Verify with gatekeeper
    console.log("[Vend402] Verifying payment with gatekeeper...")
    const verification = await this.verifyPayment(deviceId, txHash)
    console.log("[Vend402] Payment verification result:", verification)

    return verification
  }

  /**
   * Helper: Convert stroops (integer) to XLM (decimal string)
   * 1 XLM = 10,000,000 stroops
   */
  private stroopsToXlm(stroops: string): string {
    const num = BigInt(stroops)
    const xlm = Number(num) / 10_000_000
    return xlm.toFixed(7).replace(/\.?0+$/, "")
  }

  /**
   * Helper: Get account info from Horizon (for sequence number)
   */
  private async getAccountFromHorizon(publicKey: string): Promise<any> {
    const horizonUrl = this.network === "stellar-testnet" ? "https://horizon-testnet.stellar.org" : "https://horizon.stellar.org"
    const response = await fetch(`${horizonUrl}/accounts/${publicKey}`)
    if (!response.ok) {
      throw new Error(`Failed to load account: ${response.statusText}`)
    }
    const data = await response.json()
    return new Account(publicKey, data.sequence)
  }
}

/**
 * Global Freighter type augmentation
 * (In real app, this would be in @freighter/base)
 */
declare global {
  interface Window {
    freighter?: {
      signTransaction(
        txXdr: string,
        options?: { networkPassphrase?: string },
      ): Promise<string>
      getPublicKey(): Promise<string>
      isConnected(): Promise<boolean>
    }
  }
}

/**
 * Factory function: Create Vend402Client with sensible defaults
 */
export function createVend402Client(
  options: {
    gatekeeperUrl?: string
    network?: "stellar-testnet" | "stellar-mainnet"
  } = {},
): Vend402Client {
  return new Vend402Client(
    options.gatekeeperUrl || "/api/vend402-gatekeeper",
    options.network || "stellar-testnet",
  )
}

/**
 * Helper: Check if Freighter is installed
 */
export async function isFreighterAvailable(): Promise<boolean> {
  const result = await isConnected()
  if (!result || typeof result !== 'object' || !result.isConnected) {
    return false
  }
  return true
}

/**
 * Helper: Format amount for display
 */
export function formatXLM(stroops: string): string {
  const num = BigInt(stroops)
  const xlm = Number(num) / 10_000_000
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
  }).format(xlm)
}
