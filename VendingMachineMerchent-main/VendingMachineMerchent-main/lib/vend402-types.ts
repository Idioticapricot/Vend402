/**
 * Vend402 - X402 Payment Protocol for Stellar Vending Machines
 * Type definitions and schemas for payment challenges and verification
 *
 * @module vend402-types
 * @version 1.0.0
 */

/**
 * HTTP 402 Payment Challenge Response
 * Sent by the server when payment is required to access a resource
 */
export interface Vend402Challenge {
  /** Indicates this is a Vend402 payment challenge */
  vend402: true

  /** Unique identifier for this payment challenge (tied to transaction memo) */
  challengeId: string

  /** Amount to pay in stroops (1 XLM = 10,000,000 stroops) */
  amount: string

  /** Asset code - typically "XLM" for native Stellar Lumens */
  asset: "XLM"

  /** Destination Stellar account (merchant's public key) */
  destination: string

  /** Memo text to include in Stellar transaction (matches challengeId) */
  memo: string

  /** ISO 8601 timestamp when this challenge expires */
  expiresAt: string

  /** Ledger sequence number for expiry (alternative to timestamp) */
  ledgerExpiry: number

  /** Optional message to display to user */
  message?: string

  /** Optional URL to deeplink into Freighter wallet */
  freighterUrl?: string

  /** Optional Stellar URI for wallet integration */
  stellarUri?: string
}

/**
 * Vend402 Payment Verification Request
 * Sent by client after signing payment with Freighter or keypair
 */
export interface Vend402PaymentRequest {
  /** Vending machine device ID */
  deviceId: string

  /** Stellar transaction hash (hex string) proving payment was made */
  txHash: string

  /** Optional: client identifier for analytics */
  clientId?: string

  /** Optional: challenge ID being fulfilled */
  challengeId?: string
}

/**
 * Vend402 Verification Response (Success)
 * Returned after payment is verified and accepted
 */
export interface Vend402VerificationSuccess {
  success: true

  /** Confirmation message */
  message: string

  /** Transaction hash that was verified */
  txHash: string

  /** Whether dispense has been triggered */
  dispensed: boolean

  /** Optional: time until dispense timeout (milliseconds) */
  dispenseTimeoutMs?: number
}

/**
 * Vend402 Verification Response (Failure)
 * Returned when payment verification fails
 */
export interface Vend402VerificationFailure {
  success: false

  /** Error code for client handling */
  code:
    | "INVALID_TRANSACTION"
    | "INSUFFICIENT_AMOUNT"
    | "WRONG_DESTINATION"
    | "WRONG_ASSET"
    | "EXPIRED_CHALLENGE"
    | "INVALID_MEMO"
    | "TRANSACTION_NOT_FOUND"
    | "DUPLICATE_PAYMENT"
    | "UNKNOWN_ERROR"

  /** Human-readable error message */
  message: string

  /** Optional: new challenge to retry payment */
  newChallenge?: Vend402Challenge
}

/**
 * Combined verification response type
 */
export type Vend402VerificationResponse =
  | Vend402VerificationSuccess
  | Vend402VerificationFailure

/**
 * Database record for tracking Vend402 payments
 */
export interface Vend402PaymentRecord {
  /** Unique payment record ID */
  id: string

  /** Machine/device ID */
  deviceId: string

  /** Challenge ID that was fulfilled */
  challengeId: string

  /** Payment amount in stroops */
  amount: string

  /** Asset type (currently only XLM) */
  asset: "XLM"

  /** Transaction hash on Stellar network */
  txHash: string

  /** Payment status: pending → verified → settled */
  status: "pending" | "verified" | "settled" | "failed"

  /** Timestamp when challenge was issued */
  createdAt: string

  /** Timestamp when payment was verified */
  verifiedAt: string | null

  /** Timestamp when payment was settled on-chain */
  settledAt: string | null
}

/**
 * Vend402 Configuration
 * Environment and setup configuration for payment processing
 */
export interface Vend402Config {
  /** Merchant's Stellar public key (receives payments) */
  merchantAccount: string

  /** Horizon API URL (testnet or mainnet) */
  horizonUrl: string

  /** HMAC secret for challenge signing (optional) */
  hmacSecret?: string

  /** Maximum age of transaction in seconds before rejection */
  maxTxnAge: number

  /** Network: "stellar-testnet" or "stellar-mainnet" */
  network: "stellar-testnet" | "stellar-mainnet"

  /** Base URL for pay page (for generating deep links) */
  payPageBaseUrl?: string

  /** Supabase project URL */
  supabaseUrl?: string

  /** Supabase anon key */
  supabaseAnonKey?: string
}

/**
 * Horizon transaction response (simplified)
 */
export interface HorizonTransaction {
  id: string
  hash: string
  created_at: string
  source_account: string
  fee_paid: number
  operation_count: number
  memo_type: string
  memo: string
  successful: boolean
  ledger_attr: {
    sequence: number
  }
  operations: HorizonOperation[]
}

/**
 * Horizon payment operation
 */
export interface HorizonOperation {
  id: string
  type: string
  type_i: number
  from: string
  to: string
  amount: string
  asset_type: string
  asset_code?: string
  asset_issuer?: string
}

/**
 * Stellar SDK Transaction XDR wrapper
 */
export interface StellarTransactionXDR {
  tx: {
    sourceAccount: {
      accountId: string
      sequenceNumber: string
    }
    fee: number
    operations: Array<{
      sourceAccount?: {
        accountId: string
      }
      body: {
        discriminant: number
        paymentOp?: {
          destination: {
            accountId: string
          }
          asset: {
            discriminant: number
            code?: string
            issuer?: {
              accountId: string
            }
          }
          amount: string
        }
      }
    }>
    memo: {
      discriminant: number
      text?: string
      id?: string
    }
  }
  signatures: Array<{
    hint: string
    signature: string
  }>
}
