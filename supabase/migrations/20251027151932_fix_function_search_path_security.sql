/*
  # Fix Function Search Path Security Vulnerability

  1. Changes
    - Drop existing `update_updated_at_column` function
    - Recreate with `SECURITY DEFINER` and explicit `search_path` setting
    - This prevents search path manipulation attacks

  2. Security
    - Sets immutable search_path to prevent malicious schema injection
    - Uses SECURITY DEFINER to run with function owner's privileges
*/

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Recreate trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();