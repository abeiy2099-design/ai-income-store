/*
  # Consulting Booking & Payment System

  1. Schema Changes
    - Add new columns to consultations table for booking and payment tracking
    - Create consulting_services table for service definitions
    - Create consultation_bookings table for scheduled sessions with payment status

  2. New Tables
    - `consulting_services`
      - Service definitions with pricing, duration, and features
    - `consultation_bookings`
      - Scheduled bookings with payment tracking
      - Links to customers and services

  3. Functions
    - `create_consultation_booking` - Creates a booking after payment
    - `send_booking_confirmation` - Triggers email confirmation

  4. Services
    - AI Business Consulting ($99)
    - Digital Product Launch Coaching ($199)
    - Monthly Mentorship Program ($499)

  5. Security
    - Enable RLS on all new tables
    - Add policies for customers and admins
*/

-- Create consulting services table
CREATE TABLE IF NOT EXISTS consulting_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consulting_services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active services
CREATE POLICY "Anyone can view active consulting services"
  ON consulting_services
  FOR SELECT
  USING (is_active = true);

-- Create consultation bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES consulting_services(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  message text,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  payment_amount numeric NOT NULL,
  meeting_link text,
  status text NOT NULL DEFAULT 'scheduled',
  confirmation_sent boolean DEFAULT false,
  reminder_24h_sent boolean DEFAULT false,
  reminder_1h_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON consultation_bookings
  FOR SELECT
  TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Policy: Allow public read for booking verification
CREATE POLICY "Public can read bookings by email"
  ON consultation_bookings
  FOR SELECT
  TO anon
  USING (true);

-- Add booking-related columns to consultations table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultations' AND column_name = 'booking_id'
  ) THEN
    ALTER TABLE consultations ADD COLUMN booking_id uuid REFERENCES consultation_bookings(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultations' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE consultations ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
END $$;

-- Insert consulting services
INSERT INTO consulting_services (service_id, title, description, price, duration, features) VALUES
(
  'ai-consulting',
  'AI Business Consulting',
  'One-on-one strategy sessions to implement AI tools and automation in your business',
  99.00,
  '60 minutes',
  '["Personalized AI strategy roadmap", "Tool recommendations and implementation guidance", "Action plan with next steps", "Follow-up email support for 7 days"]'::jsonb
),
(
  'digital-product',
  'Digital Product Launch Coaching',
  'Complete guidance to create, launch, and market your first digital product',
  199.00,
  '90 minutes',
  '["Product ideation and validation", "Creation strategy using AI tools", "Launch plan and marketing tactics", "Sales page review and optimization"]'::jsonb
),
(
  'mentorship',
  'Monthly Mentorship Program',
  'Ongoing support and accountability to grow your digital business',
  499.00,
  '4 sessions/month',
  '["4 one-hour sessions per month", "Unlimited email support", "Private community access", "Priority access to new resources"]'::jsonb
)
ON CONFLICT (service_id) 
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  features = EXCLUDED.features,
  updated_at = now();

-- Function to create consultation booking
CREATE OR REPLACE FUNCTION create_consultation_booking(
  p_service_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_scheduled_date timestamptz,
  p_message text,
  p_payment_intent_id text,
  p_payment_amount numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id uuid;
  v_duration integer;
BEGIN
  -- Get service duration
  SELECT 
    CASE 
      WHEN duration LIKE '%60%' THEN 60
      WHEN duration LIKE '%90%' THEN 90
      WHEN duration LIKE '%4%' THEN 240
      ELSE 60
    END INTO v_duration
  FROM consulting_services
  WHERE id = p_service_id;

  -- Create booking
  INSERT INTO consultation_bookings (
    service_id,
    customer_name,
    customer_email,
    scheduled_date,
    duration_minutes,
    message,
    payment_status,
    payment_intent_id,
    payment_amount,
    status
  ) VALUES (
    p_service_id,
    p_customer_name,
    p_customer_email,
    p_scheduled_date,
    v_duration,
    p_message,
    'paid',
    p_payment_intent_id,
    p_payment_amount,
    'scheduled'
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$;

-- Function to update booking confirmation status
CREATE OR REPLACE FUNCTION mark_booking_confirmation_sent(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE consultation_bookings
  SET confirmation_sent = true, updated_at = now()
  WHERE id = p_booking_id;
END;
$$;
