import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const FUNCTION_URL = process.env.NEXT_PUBLIC_VEND402_GATEKEEPER_URL

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !FUNCTION_URL) {
    console.error('Missing environment variables. Check .env')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function verifyDeployment() {
    const deviceId = process.argv[2]
    const txHash = process.argv[3]

    if (!deviceId || !txHash) {
        console.log('Usage: npx tsx scripts/verify_deployment.ts <DEVICE_ID> <TX_HASH>')
        return
    }

    console.log(`\n🔍 Verifying Payment for Device: ${deviceId}`)
    console.log(`📝 Transaction Hash: ${txHash}`)
    console.log(`🌍 Cloud Function: ${FUNCTION_URL}`)

    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                action: 'verifyPayment',
                deviceId,
                txHash
            })
        })

        const data = await response.json()

        console.log('\n--- RESPONSE ---')
        console.log(JSON.stringify(data, null, 2))

        if (data.success) {
            console.log('\n✅ SUCCESS: The Cloud Function verified the payment!')
            console.log('This confirms that:')
            console.log('1. The function is reachable.')
            console.log('2. It successfully fetched the Merchant Wallet from the DB.')
            console.log('3. It verified the transaction on Stellar.')
            console.log('4. It broadcasted the "dispense" event.')
        } else if (data.code === 'DUPLICATE_PAYMENT') {
            console.log('\n✅ VERIFIED (Previously Used)')
            console.log('The system successfully identified this transaction as valid but ALREADY USED.')
            console.log('This proves that Double-Spend Protection is working.')
            console.log('If you saw the "DISPENSE SIGNAL" on your simulator earlier, then the system is fully functional.')
        } else {
            console.log('\n❌ FAILED: verification rejected.')
            console.log('Check the error message above.')
        }

    } catch (error) {
        console.error('\n❌ ERROR: Cloud function call failed.', error)
    }
}

verifyDeployment()
