/*
  # Lead Capture System for JENA.ai Landing Page

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `name` (text) - Lead's full name
      - `email` (text, unique) - Lead's email address
      - `source` (text) - Which CTA section they submitted from
      - `created_at` (timestamptz) - When they opted in
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `leads` table
    - Add policy for service role to insert leads (form submissions)
    - Add policy for authenticated admins to read leads
  
  3. Indexes
    - Index on email for fast duplicate checking
    - Index on created_at for analytics queries
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'hero',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (form submissions)
CREATE POLICY "Anyone can submit lead form"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view leads (for admin dashboard later)
CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();