# 🚀 Vend402: Decentralized Vending Machine Protocol
**Technical Architecture & Stellar X402 Implementation**

---

## 🏗️ 1. High-Level Architecture

Vend402 is a **DePIN (Decentralized Physical Infrastructure Network)** prototype that bridges **Stellar Payments** with **Real-World IoT Hardware**. It allows any merchant to turn a dumb vending machine into a crypto-native device without complex infrastructure.

### The Ecosystem
1.  **Merchant Dashboard (Next.js)**: Where owners manage machines and view earnings.
2.  **The "Brain" (Supabase)**: Handles user auth, machine registry, and real-time signaling.
3.  **The Gatekeeper (Edge Function)**: Validates Stellar transactions on-chain.
4.  **The Hardware (ESP32)**: Physical device that dispenses products upon payment verification.

---

## ⚡ 2. The "X402" Stellar Payment Flow

The core innovation is the **"Listen-Verify-Dispense"** loop. We do **not** hold funds. Payments are **Peer-to-Peer (P2P)** from Customer to Merchant.

### Step-by-Step Transaction Lifecycle:

#### Phase 1: Registration (The Setup)
1.  **Merchant** connects their Stellar Wallet (Freighter) to the Dashboard.
2.  **Merchant** registers a new machine.
3.  **System** generates a unique **Machine ID** (e.g., `mach_123`).
4.  **Merchant** provisions the ESP32 (Hardware) with this Machine ID.

#### Phase 2: The Purchase (The "X402" Event)
1.  **Customer** walks up to the machine and scans the QR Code.
2.  **Customer** is redirected to the **Payment Page** (`/pay/vend402/mach_123`).
3.  **Customer** pays **XLM** using their preferred wallet (Freighter).
    *   **Destination**: Merchant's Wallet Address (directly).
    *   **Memo**: `mach_123` (The unique Machine ID).
    *   **Amount**: The price set by the merchant.

#### Phase 3: Verification (The Gatekeeper)
1.  The payment is submitted to the **Stellar Network**.
2.  Our **Supabase Edge Function (`vend402-gatekeeper`)** listens for this event.
3.  It queries the **Stellar Horizon API**:
    *   *Did [Merchant Wallet] receive [Price] XLM?*
    *   *Does the transaction Memo match [mach_123]?*

#### Phase 4: Execution (Real-World Action)
1.  **Gatekeeper** confirms the transaction is valid and final.
2.  **Gatekeeper** pushes a secure **WebSocket Message** via Supabase Realtime.
3.  **ESP32 Hardware** (subscribed to `realtime:machine-mach_123`) receives the `payment_approved` signal.
4.  **ESP32** triggers the relay/motor. **Product Dispensed.** 🥤

---

## 🛠️ 3. Technical Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | Merchant Dashboard, Payment UI, Wallet Connection |
| **Blockchain** | **Stellar (Soroban/Horizon)** | Settlement Layer, Payment Verification |
| **Backend** | **Supabase** | Auth, Database (PostgreSQL), Edge Functions (Deno) |
| **IoT / Hardware** | **C++ / Arduino (ESP32)** | Physical Control, WebSocket Client, Captive Portal |
| **Realtime** | **WebSockets** | Instant < 500ms signaling from Chain to Device |

---

## 🔒 4. Key Security Features

*   **Non-Custodial**: The platform *never* touches the money. Funds go straight to the merchant.
*   **Memo-Based Routing**: Uses Stellar Memos to identify specific machines without needing a unique wallet per machine.
*   **Double-Spend Protection**: The Gatekeeper logs every transaction hash in the database to prevent reusing a payment.
*   **Hardware Isolation**: The ESP32 does not hold private keys; it only listens for a "Success" signal from the trusted Gatekeeper.

---

## 🎯 5. Hackathon Criteria Checklist

*   **[x] Real-World Utility**: Automates physical commerce using crypto.
*   **[x] Stellar Integration**: Uses Stellar for fast, low-cost settlement (XLM).
*   **[x] Technical Complexity**: Full stack integration (IoT + Web + Blockchain).
*   **[x] UX**: Zero-config hardware provisioning (Captive Portal) and seamless QR payments.
