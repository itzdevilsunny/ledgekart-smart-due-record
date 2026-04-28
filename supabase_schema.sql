-- =============================================
-- LedgerKart Complete Database Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jxqqexzghiiyreksnhza/sql/new
-- =============================================

-- 1. Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT UNIQUE,
  role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Shops
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  credit_limit NUMERIC DEFAULT 10000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id, phone)
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT DEFAULT 'pcs',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ledger Entries
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  entry_type TEXT CHECK (entry_type IN ('purchase', 'payment')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ledger_entry_id UUID REFERENCES ledger_entries(id) ON DELETE CASCADE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'other')) DEFAULT 'cash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Enable RLS ───────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Owners can manage their shops" ON shops FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Shop owners manage customers" ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = customers.shop_id AND shops.owner_id = auth.uid())
);
CREATE POLICY "Customers view own record" ON customers FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Shop owners manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid())
);

CREATE POLICY "Shop owners manage ledger" ON ledger_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM shops WHERE shops.id = ledger_entries.shop_id AND shops.owner_id = auth.uid())
);
CREATE POLICY "Customers view own ledger" ON ledger_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM customers WHERE customers.id = ledger_entries.customer_id AND customers.profile_id = auth.uid())
);

CREATE POLICY "Shop owners manage payments" ON payments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM ledger_entries le
    JOIN shops s ON s.id = le.shop_id
    WHERE le.id = payments.ledger_entry_id AND s.owner_id = auth.uid()
  )
);

-- ─── Trigger: Auto-create profile on signup ───
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;

  -- If it's a customer, auto-link existing customer records by phone
  IF (NEW.raw_user_meta_data->>'role' = 'customer') THEN
    UPDATE customers 
    SET profile_id = NEW.id 
    WHERE phone = (NEW.raw_user_meta_data->>'phone')
    AND profile_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── View: Customer balance summary ───────────
CREATE OR REPLACE VIEW customer_balances AS
SELECT 
  c.id AS customer_id,
  c.shop_id,
  c.name,
  c.phone,
  c.credit_limit,
  COALESCE(SUM(CASE WHEN le.entry_type = 'purchase' THEN le.amount ELSE 0 END), 0) AS total_purchase,
  COALESCE(SUM(CASE WHEN le.entry_type = 'payment' THEN le.amount ELSE 0 END), 0) AS total_paid,
  COALESCE(SUM(CASE WHEN le.entry_type = 'purchase' THEN le.amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN le.entry_type = 'payment' THEN le.amount ELSE 0 END), 0) AS balance_due
FROM customers c
LEFT JOIN ledger_entries le ON le.customer_id = c.id
GROUP BY c.id, c.shop_id, c.name, c.phone, c.credit_limit;
