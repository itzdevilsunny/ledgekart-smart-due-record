import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl && typeof window === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL is missing. Please add it to Vercel Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ──────────────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'admin' | 'customer';
  created_at: string;
};

export type Shop = {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  shop_id: string;
  profile_id: string | null;
  name: string;
  phone: string;
  credit_limit: number;
  created_at: string;
};

export type Product = {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  unit: string;
  created_at: string;
};

export type LedgerEntry = {
  id: string;
  customer_id: string;
  shop_id: string;
  amount: number;
  description: string | null;
  entry_type: 'purchase' | 'payment';
  created_at: string;
};

export type CustomerBalance = {
  customer_id: string;
  shop_id: string;
  name: string;
  phone: string;
  credit_limit: number;
  total_purchase: number;
  total_paid: number;
  balance_due: number;
  created_at?: string;
};

// ─── Auth Helpers ────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, full_name: string, phone: string, role: 'admin' | 'customer') {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, phone, role } },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

// ─── Shop Helpers ─────────────────────────────────────────────────────────────

export async function getShopByOwner(ownerId: string) {
  return supabase.from('shops').select('*').eq('owner_id', ownerId).single();
}

export async function createShop(ownerId: string, name: string, address: string, phone: string) {
  return supabase.from('shops').insert({ owner_id: ownerId, name, address, phone }).select().single();
}

// ─── Customer Helpers ─────────────────────────────────────────────────────────

export async function getCustomers(shopId: string) {
  return supabase
    .from('customer_balances')
    .select('*')
    .eq('shop_id', shopId)
    .order('name');
}

export async function createCustomer(shopId: string, name: string, phone: string, credit_limit: number) {
  return supabase.from('customers').insert({ shop_id: shopId, name, phone, credit_limit }).select().single();
}

export async function getCustomerById(customerId: string) {
  return supabase.from('customer_balances').select('*').eq('customer_id', customerId).single();
}

export async function getCustomerByProfile(profileId: string) {
  return supabase
    .from('customers')
    .select('*, shops(*)')
    .eq('profile_id', profileId)
    .single();
}

// ─── Product Helpers ──────────────────────────────────────────────────────────

export async function getProducts(shopId: string) {
  return supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('name');
}

export async function createProduct(shopId: string, name: string, price: number, unit: string) {
  return supabase.from('products').insert({ shop_id: shopId, name, price, unit }).select().single();
}

// ─── Ledger Helpers ───────────────────────────────────────────────────────────

export async function getLedgerEntries(customerId: string) {
  return supabase
    .from('ledger_entries')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
}

export async function addPurchase(shopId: string, customerId: string, amount: number, description: string) {
  return supabase
    .from('ledger_entries')
    .insert({ shop_id: shopId, customer_id: customerId, amount, description, entry_type: 'purchase' })
    .select()
    .single();
}

export async function addPayment(shopId: string, customerId: string, amount: number, method: string) {
  const { data: entry, error: entryErr } = await supabase
    .from('ledger_entries')
    .insert({ shop_id: shopId, customer_id: customerId, amount, description: `Payment via ${method}`, entry_type: 'payment' })
    .select()
    .single();

  if (entryErr || !entry) return { data: null, error: entryErr };

  return supabase
    .from('payments')
    .insert({ ledger_entry_id: entry.id, payment_method: method })
    .select()
    .single();
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(shopId: string) {
  // Use a single query to get aggregated data
  const { data, error } = await supabase
    .from('customer_balances')
    .select('balance_due, total_paid, total_purchase')
    .eq('shop_id', shopId);

  if (error || !data) return { totalDue: 0, totalCollected: 0, pendingCustomers: 0, totalCustomers: 0 };

  let totalDue = 0;
  let totalCollected = 0;
  let pendingCustomers = 0;

  for (const r of data) {
    const due = Number(r.balance_due);
    totalDue += due;
    totalCollected += Number(r.total_paid);
    if (due > 0) pendingCustomers++;
  }

  return { totalDue, totalCollected, pendingCustomers, totalCustomers: data.length };
}

export async function getRecentTransactions(shopId: string, limit = 10) {
  return supabase
    .from('ledger_entries')
    .select('id, amount, entry_type, description, created_at, customers(name, phone)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);
}
