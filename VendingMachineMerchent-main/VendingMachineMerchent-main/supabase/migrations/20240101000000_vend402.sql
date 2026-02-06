-- Challenges issued to customers
CREATE TABLE IF NOT EXISTS vend402_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id TEXT UNIQUE NOT NULL,
  device_id TEXT NOT NULL,
  amount TEXT NOT NULL,           -- In stroops
  destination TEXT NOT NULL,      -- Merchant Stellar address
  memo TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Completed payments
CREATE TABLE IF NOT EXISTS vend402_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  amount TEXT NOT NULL,           -- In stroops
  asset TEXT NOT NULL,            -- "XLM"
  tx_hash TEXT UNIQUE NOT NULL,   -- Stellar transaction hash
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | verified | settled | failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vend402_challenges_device ON vend402_challenges(device_id);
CREATE INDEX IF NOT EXISTS idx_vend402_challenges_expires ON vend402_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_vend402_payments_device ON vend402_payments(device_id);
CREATE INDEX IF NOT EXISTS idx_vend402_payments_tx_hash ON vend402_payments(tx_hash);
