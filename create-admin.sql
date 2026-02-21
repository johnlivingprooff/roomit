-- Run this in Neon SQL Editor to create admin account

-- Create users table if not exists (for fresh setup)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'renter' CHECK (role IN ('renter', 'host', 'admin')),
  name VARCHAR(255),
  avatar_url TEXT,
  verified_status VARCHAR(20) DEFAULT 'none' CHECK (verified_status IN ('none', 'pending', 'verified')),
  id_document_url TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Admin User
INSERT INTO users (phone, email, name, role, verified_status, risk_score)
VALUES 
  ('+265888000000', 'admin@roomie.mw', 'Admin', 'admin', 'verified', 0),
  ('+265999000000', 'host@roomie.mw', 'John Host', 'host', 'verified', 0),
  ('+265999000001', 'renter@roomie.mw', 'Jane Renter', 'renter', 'verified', 0)
ON CONFLICT (phone) DO NOTHING;

-- Verify
SELECT id, phone, name, role, verified_status FROM users;
