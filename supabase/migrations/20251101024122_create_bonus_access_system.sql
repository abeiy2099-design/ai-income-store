/*
  # Bonus Access Control System

  1. Schema Changes
    - Add `requires_product_id` column to products table
      - Links bonus products to the main product that must be purchased
    - Add `is_bonus` column to products table
      - Marks products as bonus items
    - Add `bonus_note` column to products table
      - Stores the bonus access rule text

  2. New Tables
    - `customer_product_access`
      - Tracks which customers have access to which products
      - Links customers (by email) to products they've purchased or earned access to

  3. Functions
    - `check_bonus_access` - Checks if a customer has access to a bonus product
    - `grant_bonus_access` - Automatically grants bonus access after purchase

  4. Products
    - Creates "Zero to AI Income" (paid eBook)
    - Creates "50 ChatGPT Prompts" (free bonus)
    - Creates "Website Launch Course" (free bonus)

  5. Security
    - Enable RLS on new table
    - Add policies for customers to view their own access
*/

-- Add new columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'requires_product_id'
  ) THEN
    ALTER TABLE products ADD COLUMN requires_product_id uuid REFERENCES products(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_bonus'
  ) THEN
    ALTER TABLE products ADD COLUMN is_bonus boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'bonus_note'
  ) THEN
    ALTER TABLE products ADD COLUMN bonus_note text;
  END IF;
END $$;

-- Create customer product access table
CREATE TABLE IF NOT EXISTS customer_product_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  access_granted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(email, product_id)
);

ALTER TABLE customer_product_access ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own access
CREATE POLICY "Customers can view own product access"
  ON customer_product_access
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Policy: Allow public read for access checking (needed for non-authenticated users)
CREATE POLICY "Public can check product access by email"
  ON customer_product_access
  FOR SELECT
  TO anon
  USING (true);

-- Function to check if customer has access to a bonus product
CREATE OR REPLACE FUNCTION check_bonus_access(customer_email text, bonus_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  required_product_id uuid;
  has_access boolean;
BEGIN
  -- Get the required product ID for this bonus
  SELECT requires_product_id INTO required_product_id
  FROM products
  WHERE id = bonus_product_id AND is_bonus = true;

  -- If no required product, anyone has access (it's not a restricted bonus)
  IF required_product_id IS NULL THEN
    RETURN true;
  END IF;

  -- Check if customer has purchased the required product
  SELECT EXISTS (
    SELECT 1
    FROM customer_product_access
    WHERE email = customer_email
    AND product_id = required_product_id
  ) INTO has_access;

  RETURN has_access;
END;
$$;

-- Function to automatically grant bonus access after purchase
CREATE OR REPLACE FUNCTION grant_bonus_access_after_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bonus_product record;
  purchased_product_id uuid;
BEGIN
  -- Only process when payment is completed
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    -- Get the product that was purchased from order_items
    FOR purchased_product_id IN
      SELECT product_id FROM order_items WHERE order_id = NEW.id
    LOOP
      -- Grant access to the purchased product
      INSERT INTO customer_product_access (email, product_id, order_id)
      VALUES (NEW.email, purchased_product_id, NEW.id)
      ON CONFLICT (email, product_id) DO NOTHING;

      -- Find and grant access to all bonus products that require this product
      FOR bonus_product IN
        SELECT id FROM products WHERE requires_product_id = purchased_product_id AND is_bonus = true
      LOOP
        INSERT INTO customer_product_access (email, product_id, order_id)
        VALUES (NEW.email, bonus_product.id, NEW.id)
        ON CONFLICT (email, product_id) DO NOTHING;
      END LOOP;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for automatic bonus access
DROP TRIGGER IF EXISTS grant_bonus_access_trigger ON orders;
CREATE TRIGGER grant_bonus_access_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION grant_bonus_access_after_purchase();

-- Insert the products
INSERT INTO products (title, description, price, image_url, download_url, category, is_featured, is_bonus, bonus_note)
VALUES
(
  'Zero to AI Income',
  'Learn how to turn your ideas into real income using AI tools in just 7 days. This comprehensive eBook includes step-by-step strategies, practical examples, and proven systems to launch your first digital product.

Bonus Access Rule:
The two free bonuses — 50 ChatGPT Prompts and Website Launch Course — are exclusively available to customers who purchase the Zero to AI Income eBook. Once your order is completed, you''ll automatically receive your bonus download links via email.',
  29.99,
  '/Zero to Ai income.png',
  'https://example.com/downloads/zero-to-ai-income.pdf',
  'digital',
  true,
  false,
  NULL
),
(
  '50 ChatGPT Prompts for Business Growth',
  'A curated collection of 50 powerful ChatGPT prompts designed to help you grow your business, create content, and automate tasks.

⚠️ Access Restricted:
This free bonus is only available to verified customers who purchased the "Zero to AI Income" eBook. Please complete your order first to unlock your bonuses instantly.',
  0,
  '/Free Product Image (1).png',
  'https://example.com/downloads/50-chatgpt-prompts.pdf',
  'digital',
  false,
  true,
  'These free bonuses are only available to verified customers who purchased the "Zero to AI Income" eBook. Please complete your order first to unlock your bonuses instantly.'
),
(
  'Website Launch Course',
  'A complete step-by-step video course on launching your first website, from domain registration to going live.

⚠️ Access Restricted:
This free bonus is only available to verified customers who purchased the "Zero to AI Income" eBook. Please complete your order first to unlock your bonuses instantly.',
  0,
  '/Free Product Image (2).png',
  'https://example.com/downloads/website-launch-course.zip',
  'digital',
  false,
  true,
  'These free bonuses are only available to verified customers who purchased the "Zero to AI Income" eBook. Please complete your order first to unlock your bonuses instantly.'
);

-- Link bonus products to the main product
UPDATE products
SET requires_product_id = (SELECT id FROM products WHERE title = 'Zero to AI Income' LIMIT 1)
WHERE title IN ('50 ChatGPT Prompts for Business Growth', 'Website Launch Course');
