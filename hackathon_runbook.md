# 🚀 Vend402 Hackathon Runbook

This is your **Master Guide** to running the Vend402 system. Follow these steps sequentially to ensure a smooth demo.

## 📦 System Overview
*   **Frontend**: Next.js (Merchant Dashboard + Payment Page)
*   **Backend**: Supabase (Auth, Database, Realtime) + Edge Function (`vend402-gatekeeper`)
*   **Hardware**: ESP32 (connects to Supabase via WebSocket)
*   **Blockchain**: Stellar Testnet (Freighter Wallet)

---

## ✅ Step 1: Backend Verification
**Goal**: Ensure the "Brain" is alive.

1.  **Check Supabase Edge Function**:
    *   Run the verification script to confirm the payment logic is working.
    ```bash
    cd VendingMachineMerchent-main/VendingMachineMerchent-main
    npx tsx scripts/verify_deployment.ts
    ```
    *   **Expected Output**:
        *   `✅ Gatekeeper Response: 402 Payment Required` (Correct)
        *   `✅ Payment Verification Logic: Checked`

---

## 🖥️ Step 2: Frontend Setup
**Goal**: Get the Merchant Dashboard running.

1.  **Environment Variables** (`.env.local`):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_VEND402_GATEKEEPER_URL=https://<project-ref>.supabase.co/functions/v1/vend402-gatekeeper
    ```
2.  **Run Locally**:
    ```bash
    npm run dev
    ```
3.  **Open Dashboard**: Go to `http://localhost:3000`.
4.  **Login/Signup**:
    *   Use **Email/Password** (Sign Up tab first!).
    *   **Verify**: You should see the dashboard.
5.  **Connect Wallet**:
    *   Click the user avatar (top right).
    *   Click **Connect Wallet** (ensure Freighter is unlocking).
    *   **Verify**: Button changes to show your XLM balance.

---

## 🤖 Step 3: Hardware Setup (The "Box")
**Goal**: Online and waiting for money.

1.  **Flash Firmware**:
    *   Open `VendingMachine-main/VendingMachine-main/QR_CODE.ino` in Arduino IDE.
    *   **CRITICAL**: Ensure `stellarConfig.merchantApiBase` points to your app (e.g., `https://your-vercel-app.vercel.app/api/`).
    *   Upload to ESP32.
2.  **Provisioning**:
    *   Connect to WiFi `ESP32-Setup`.
    *   Go to `192.168.4.1`.
    *   Enter your WiFi credentials.
    *   Enter **API Key** (Get this from Dashboard -> Machine -> Settings).
    *   **Verify**: ESP32 screen shows "Ready" or a QR Code.

---

## 💰 Step 4: The Golden Demo Flow
**Goal**: Conduct a live transaction.

1.  **Create Machine**:
    *   Dashboard -> "Register New Machine".
    *   Name: "Demo Bot".
    *   Price: `1` XLM.
    *   **Copy API Key**.
2.  **Link Hardware**:
    *   (If not done in Step 3) Use the API Key to provision the ESP32.
3.  **Customer Payment**:
    *   Scan the QR code on the ESP32 screen (or Dashboard).
    *   It opens the Payment Page (`http://.../pay/vend402/...`).
    *   Click **Pay with Freighter**.
    *   Approve Tx.
4.  **Dispense**:
    *   **Frontend**: Shows "Payment Successful! Dispensing...".
    *   **Hardware**: Screen shows "Payment Received!" and motor spins.
    *   **Backend**: Database records the transaction.

---

## 🚨 Troubleshooting

### 1. "Invalid credentials" Login Error
*   **Fix**: You probably didn't "Sign Up" yet. Click the **Check "Sign Up" tab**.
*   **Fix**: Check Supabase Dashboard -> Auth -> Providers -> Email -> **Disable "Confirm Email"**.

### 2. "Unique constraint failed" (Wallet)
*   **Fix**: Click "Connect Wallet" again. I fixed the backend to auto-reassign wallets.

### 3. Hardware not Dispensing?
*   **Backup Plan**: Run the simulator script!
    ```bash
    npx tsx scripts/simulate_machine.ts
    ```
    *   This pretends to be the hardware. If *this* works, the issue is your ESP32 WiFi/Power.
    *   If *this* fails, the issue is Supabase Realtime/Backend.

### 4. Rate Limit Exceeded (Email)
*   **Fix**: Switch email address (e.g., `test+1@gmail.com`) or wait 15 mins. (Disable "Confirm Email" prevents this mostly).
