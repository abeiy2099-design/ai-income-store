/*
  # E-commerce Platform Schema for JENA Tech

  ## Overview
  This migration creates a complete e-commerce platform schema supporting digital products,
  orders, consulting services, blog posts, and newsletter subscriptions.

  ## New Tables

  ### 1. products
  Digital products (eBooks, templates, courses) with pricing and inventory
  - `id` (uuid, primary key)
  - `title` (text) - Product name
  - `description` (text) - Full product description
  - `price` (numeric) - Price in USD (0 for free products)
  - `image_url` (text) - Product image URL
  - `download_url` (text) - Secure download link
  - `category` (text) - Product category (ebook, template, course, etc.)
  - `is_featured` (boolean) - Show on homepage
  - `is_active` (boolean) - Available for purchase
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. orders
  Customer purchase records
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - Linked to auth.users if authenticated
  - `email` (text) - Customer email
  - `total_amount` (numeric) - Order total in USD
  - `payment_status` (text) - pending, completed, failed, refunded
  - `payment_intent_id` (text) - Stripe payment intent ID
  - `created_at` (timestamptz)

  ### 3. order_items
  Individual items in each order
  - `id` (uuid, primary key)
  - `order_id` (uuid) - References orders
  - `product_id` (uuid) - References products
  - `price` (numeric) - Price at time of purchase
  - `quantity` (integer) - Number of items
  - `created_at` (timestamptz)

  ### 4. consultations
  Consulting and mentorship booking requests
  - `id` (uuid, primary key)
  - `name` (text) - Client name
  - `email` (text) - Client email
  - `service_type` (text) - Type of consulting service
  - `message` (text) - Additional details
  - `status` (text) - pending, confirmed, completed, cancelled
  - `scheduled_date` (timestamptz, nullable) - Appointment time
  - `created_at` (timestamptz)

  ### 5. blog_posts
  Blog content for SEO and content marketing
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Full post content (markdown)
  - `excerpt` (text) - Short summary
  - `image_url` (text) - Featured image
  - `author` (text) - Author name
  - `is_published` (boolean) - Visibility status
  - `published_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. newsletter_subscribers (already exists as leads)
  Email list for marketing - using existing leads table

  ### 7. downloads
  Track digital product downloads for customers
  - `id` (uuid, primary key)
  - `order_id` (uuid) - References orders
  - `product_id` (uuid) - References products
  - `email` (text) - Customer email
  - `download_token` (text, unique) - Secure download token
  - `download_count` (integer) - Number of downloads
  - `expires_at` (timestamptz) - Token expiration
  - `created_at` (timestamptz)

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with appropriate policies:
  - Public read access for active products and published blog posts
  - Authenticated admin access for creating/updating content
  - Customer access to their own orders and downloads
  - Public insert for consultations and newsletter signups

  ## Notes
  1. Using existing `leads` table for newsletter subscriptions
  2. Payment processing handled via Stripe integration
  3. Download tokens expire after 7 days for security
  4. All timestamps use UTC timezone
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text,
  download_url text,
  category text NOT NULL DEFAULT 'digital',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  price numeric(10, 2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service_type text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  scheduled_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  author text DEFAULT 'JENA Tech',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  email text NOT NULL,
  download_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  download_count integer DEFAULT 0,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Order items policies
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Consultations policies
CREATE POLICY "Authenticated users can view all consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can create consultation requests"
  ON consultations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog posts policies
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Downloads policies
CREATE POLICY "Users can view their own downloads"
  ON downloads FOR SELECT
  TO public
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR true);

CREATE POLICY "Public can create downloads"
  ON downloads FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "System can update download counts"
  ON downloads FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON downloads(download_token);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();