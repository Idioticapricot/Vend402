
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables for local testing convenience
// You can also just hardcode them here if you want since this is a throwaway script
const SUPABASE_URL = "https://mrsvbhcsbwxkrpzrrvun.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc3ZiaGNzYnd4a3JwenJydnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODYyNzQsImV4cCI6MjA4NTk2MjI3NH0.7-12mrWqMr7vu_fj83lyRo3L-DCR62JpQuzLqzSp9GI";
const DEVICE_ID = "cmlbtd1300003v96inpx5zm9n";

console.log(`[Simulator] Connecting to Supabase Realtime for ${DEVICE_ID}...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const channel = supabase.channel(`machine-${DEVICE_ID}`)
    .on(
        'broadcast',
        { event: 'vend402_dispense' },
        (payload) => {
            console.log('\n✅✅✅ EVENT RECEIVED! ✅✅✅');
            console.log('------------------------------------------------');
            console.log('Event Name: vend402_dispense');
            console.log('Payload:', JSON.stringify(payload, null, 2));
            console.log('------------------------------------------------');
            console.log('In real life, the motor would be spinning right now! 🥤');
            console.log('\nWait for next payment or Press Ctrl+C to exit.');
        }
    )
    .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log(`[Simulator] Listening for events on channel: machine-${DEVICE_ID}`);
            console.log(`[Simulator] READY! Go make a payment now.`);
        }
    });

// Keep process alive
process.stdin.resume();
