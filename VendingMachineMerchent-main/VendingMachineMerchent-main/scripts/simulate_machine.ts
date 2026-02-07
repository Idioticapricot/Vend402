import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing environment variables. Check .env')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function simulateMachine() {
    const deviceId = process.argv[2]

    if (!deviceId) {
        console.log('Usage: npx tsx scripts/simulate_machine.ts <DEVICE_ID>')
        return
    }

    console.log(`\n🤖 SIMULATING VENDING MACHINE: ${deviceId}`)
    console.log(`📡 Connecting to Supabase Realtime...`)
    console.log(`👂 Listening for 'vend402_dispense' events on channel 'machine-${deviceId}'...`)
    console.log('--- Press Ctrl+C to stop ---\n')

    const channel = supabase.channel(`machine-${deviceId}`)
        .on(
            'broadcast',
            { event: 'vend402_dispense' },
            (payload) => {
                console.log('\n⚡️ RECEIVED DISPENSE SIGNAL! ⚡️')
                console.log('-----------------------------------')
                console.log('Content:', payload)
                console.log('-----------------------------------')
                console.log('✅ Hardware would be dispensing now!')
                console.log('Waiting for next event...')
            }
        )
        .subscribe((status) => {
            console.log(`Status: ${status}`)
            if (status === 'SUBSCRIBED') {
                console.log('🟢 Connected and Waiting.')
            }
        })

}

simulateMachine()
