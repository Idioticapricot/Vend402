/**
 * Vend402 - Environment Configuration Template
 * Copy this file and fill in your actual values
 */

// ============================================
// FRONTEND CONFIGURATION (.env.local)
// ============================================

// Vend402 gatekeeper endpoint
// Use "/api/vend402-gatekeeper" for local/same-origin
// Or full URL for remote deployment
NEXT_PUBLIC_VEND402_GATEKEEPER_URL=http://localhost:54321/functions/v1/vend402-gatekeeper

// Stellar network
// Options: "stellar-testnet" or "stellar-mainnet"
NEXT_PUBLIC_VEND402_NETWORK=stellar-testnet

// (Optional) Horizon API URL (auto-configured based on network if not set)
// NEXT_PUBLIC_VEND402_HORIZON_URL=https://horizon-testnet.stellar.org

// (Optional) Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

// ============================================
// SUPABASE EDGE FUNCTION ENVIRONMENT VARIABLES
// ============================================

# Set these in Supabase console: Settings → Edge Functions → Environment Variables

# Stellar public key that receives payments (YOUR MERCHANT ADDRESS)
# Get from: https://friendbot.stellar.org/ (testnet) or your existing Stellar account
VEND402_MERCHANT_ACCOUNT=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Horizon API endpoint
# Testnet: https://horizon-testnet.stellar.org
# Mainnet: https://horizon.stellar.org
VEND402_HORIZON_URL=https://horizon-testnet.stellar.org

# Stellar network identifier
# Options: "stellar-testnet" or "stellar-mainnet"
VEND402_NETWORK=stellar-testnet

# HMAC secret for challenge signing (optional, for extra security)
# Generate with: openssl rand -base64 32
VEND402_HMAC_SECRET=your-hmac-secret-here

# Supabase configuration (auto-provided by Supabase, usually no need to set)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

// ============================================
// HARDWARE CONFIGURATION (Arduino/ESP32)
// ============================================

// In your Arduino sketch (QR_CODE.ino), modify these constants:

// Your merchant Stellar address
const char* VEND402_MERCHANT_ACCOUNT = "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// Vend402 gatekeeper URL
const char* VEND402_GATEKEEPER_URL = "https://your-domain.com/api/vend402-gatekeeper";

// Relay/motor pin connected to dispense solenoid
const int RELAY_PIN = 22;

// How long to activate relay (milliseconds)
const int DISPENSE_DURATION_MS = 2000;

// Supabase configuration for Realtime listening
const char* SUPABASE_URL = "https://your-project.supabase.co";
const char* SUPABASE_ANON_KEY = "your-anon-key-here";

// ============================================
// EXAMPLE VALUES (REPLACE THESE)
// ============================================

/*
  TESTNET EXAMPLE:

  Stellar public key (merchant account):
    GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    (You get this from: https://friendbot.stellar.org/)

  Horizon testnet URL:
    https://horizon-testnet.stellar.org

  Supabase testnet project:
    https://lhnbipgsxrvonbblcekw.supabase.co
    (Replace with YOUR project URL)

  Frontend environment file (.env.local):
    NEXT_PUBLIC_VEND402_GATEKEEPER_URL=http://localhost:54321/functions/v1/vend402-gatekeeper
    NEXT_PUBLIC_VEND402_NETWORK=stellar-testnet
    NEXT_PUBLIC_SUPABASE_URL=https://lhnbipgsxrvonbblcekw.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  Supabase Edge Function environment:
    VEND402_MERCHANT_ACCOUNT=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    VEND402_HORIZON_URL=https://horizon-testnet.stellar.org
    VEND402_NETWORK=stellar-testnet
    SUPABASE_URL=https://lhnbipgsxrvonbblcekw.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*/

// ============================================
// QUICK START CHECKLIST
// ============================================

/*
1. CREATE STELLAR TESTNET ACCOUNT
   - Go to: https://friendbot.stellar.org/
   - Enter email
   - Save the provided public key (starts with G)
   - You're funded with 10,000 testnet XLM!

2. CREATE SUPABASE PROJECT
   - Go to: https://supabase.com
   - Click "New project"
   - Save the project URL and anon key

3. CREATE DATABASE TABLES
   - In Supabase console → SQL Editor
   - Run the SQL from VEND402_WALKTHROUGH.md → "Database Schema"

4. SET ENVIRONMENT VARIABLES
   - Frontend: Create .env.local file
   - Backend: Supabase console → Edge Functions → Environment

5. DEPLOY EDGE FUNCTION
   - Supabase console → Edge Functions → Create function
   - Name: "vend402-gatekeeper"
   - Paste code from vend402-gatekeeper.ts
   - Click "Deploy"

6. COPY FRONTEND FILES
   - lib/vend402-types.ts
   - lib/vend402-client.ts
   - app/pay/vend402/[machine-id]/page.tsx (Vend402PayPage.tsx)

7. TEST
   - npm run dev
   - Navigate to http://localhost:3000/pay/vend402/machine-123
   - Click "Initiate Payment"
   - Approve in Freighter
   - See "Payment Successful!"

8. DEPLOY HARDWARE CODE
   - Add vend402-hardware.ino code to your QR_CODE.ino
   - Update relay pin and SSID/password
   - Upload to ESP32

9. TEST END-TO-END
   - Scan QR code on vending machine
   - Pay from Freighter
   - Verify relay activates

CONGRATULATIONS! You now have a working Vend402 vending machine! 🎉
*/
