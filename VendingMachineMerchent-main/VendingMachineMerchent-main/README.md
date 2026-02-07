# Vend402: Stellar X402 Vending Machine
**Stellar Community Hackathon Submission**

> A "Leakproof" Blockchain Vending Machine using Native Stellar Payments, Supabase Edge Functions, and ESP32 Hardware.

## 🚀 The Stack
*   **Blockchain**: Stellar Testnet (Native XLM)
*   **Wallet**: Freighter (Browser Extension)
*   **Frontend**: Next.js 14 + Tailwind CSS
*   **Backend**: Supabase Edge Functions (Gatekeeper) + Realtime
*   **Hardware**: ESP32 + TFT Display + Relay Module (Motor Control)

## 💡 How It Works
The system implements the **X402 Protocol** (Payment Required) flow:
1.  **User** scans the machine QR code or visits the payment URL.
2.  **Gatekeeper** checks the machine price and issues a `402 Payment Required` challenge.
3.  **Frontend** prompts the user to sign a Stellar Transaction (XLM) via Freighter.
4.  **Network** validates the secure signature and transfers funds.
5.  **Gatekeeper** listens to the blockchain, verifies the payment, and broadcasts a secure `dispense` signal via WebSocket.
6.  **Hardware** receives the signal and activates the motor.

## 🛠️ Setup & Usage

### 1. Prerequisites
*   Node.js 18+
*   Freighter Wallet Extension (Testnet)

### 2. Run the Merchant App
```bash
cd VendingMachineMerchent-main
npm install
npm run dev
```
Visit: `http://localhost:3000/pay/vend402/machine-123`

### 3. Verify Hardware (Simulation)
If you don't have the physical ESP32 with you, you can simulate it:
```bash
# In a separate terminal
node scripts/verify-realtime.js
```

## 🔐 "Leakproof" Security
*   **No Client-Side Trust**: The frontend cannot trigger the dispense. Only the authoritative cloud function can.
*   **Blockchain Verification**: The Gatekeeper confirms the transaction actually happened on the Stellar Ledger before signaling the hardware.
*   **Realtime**: Supabase Realtime ensures sub-second latency between payment and dispense.

## ❓ FAQ

### Why no "Smart Contract"?
Unlike Ethereum where you need a contract (ERC-20) just to move tokens, **Stellar has "Payment" as a built-in feature**.
1.  **Speed**: Native operations execute in < 5 seconds.
2.  **Cost**: Fractions of a cent (0.00001 XLM).
3.  **Safety**: No risk of buggy contract code losing funds. The "intelligence" is handled by the **Gatekeeper (Off-chain Oracle)** pattern, which is standard for real-world hardware integration.
