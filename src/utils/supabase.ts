import { createClient } from '@supabase/supabase-js';

// Default to dummy values during build to prevent crash, but warn user
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key').trim();

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && typeof window === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL is missing. Please add it to Vercel Environment Variables to enable database features.');
}

if (typeof window !== 'undefined') {
  console.log('Supabase client initialized with URL:', supabaseUrl);
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
  upi_id: string | null;
  gstin: string | null;
  logo_url: string | null;
  notify_whatsapp: boolean;
  notify_email: boolean;
  notify_push: boolean;
  created_at: string;
};

export type ShopMember = {
  id: string;
  shop_id: string;
  profile_id: string | null;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'invited' | 'disabled';
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
};

export type Customer = {
  id: string;
  shop_id: string;
  profile_id: string | null;
  name: string;
  phone: string;
  email: string | null;
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

export interface DashboardStats {
  totalDue: number;
  totalCollected: number;
  totalPaid?: number; // Alias for totalCollected
  totalPurchase?: number;
  pendingCustomers: number;
  totalCustomers: number;
}

export type CustomerBalance = {
  customer_id: string;
  shop_id: string;
  name: string;
  phone: string;
  email: string | null;
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
  return supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
}

// ─── Shop Helpers ─────────────────────────────────────────────────────────────

export async function getShopByOwner(ownerId: string) {
  return supabase.from('shops').select('*').eq('owner_id', ownerId).maybeSingle();
}

export async function createShop(ownerId: string, shopData: Partial<Shop>) {
  return supabase.from('shops').insert({ ...shopData, owner_id: ownerId }).select().maybeSingle();
}

export async function updateShop(shopId: string, updates: Partial<Shop>) {
  return supabase.from('shops').update(updates).eq('id', shopId);
}

export async function getShop(shopId: string) {
  return supabase.from('shops').select('*').eq('id', shopId).single();
}

// ─── Shop Members ───────────────────────────────────────────────────────────

export async function getShopMembers(shopId: string) {
  return supabase
    .from('shop_members')
    .select('*, profiles(full_name)')
    .eq('shop_id', shopId);
}

export async function addShopMember(shopId: string, email: string, role: 'admin' | 'staff') {
  return supabase
    .from('shop_members')
    .insert({ shop_id: shopId, email, role })
    .select()
    .single();
}

export async function updateShopMember(memberId: string, updates: Partial<ShopMember>) {
  return supabase
    .from('shop_members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();
}

export async function removeShopMember(memberId: string) {
  return supabase
    .from('shop_members')
    .delete()
    .eq('id', memberId);
}

// ─── Customer Helpers ─────────────────────────────────────────────────────────

export async function getCustomers(shopId: string) {
  return supabase
    .from('customer_balances')
    .select('*')
    .eq('shop_id', shopId)
    .order('name');
}

export async function createCustomer(shopId: string, name: string, phone: string, email: string | null, credit_limit: number) {
  return supabase.from('customers').insert({ shop_id: shopId, name, phone, email, credit_limit }).select().single();
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

export async function linkCustomerByEmail(profileId: string, email: string) {
  return supabase
    .from('customers')
    .update({ profile_id: profileId })
    .eq('email', email)
    .is('profile_id', null)
    .select('*, shops(*)')
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

  return { data: entry, error: null };
}

// ─── Storage Helpers ─────────────────────────────────────────────────────────

export async function uploadShopLogo(shopId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${shopId}/logo.${fileExt}`;

  // Upload to 'logos' bucket
  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { data: null, error: uploadError };

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath);

  // Update shop record
  return supabase
    .from('shops')
    .update({ logo_url: publicUrl })
    .eq('id', shopId)
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
  let totalPurchase = 0;
  let pendingCustomers = 0;

  for (const r of data) {
    const due = Number(r.balance_due);
    totalDue += due;
    totalCollected += Number(r.total_paid);
    totalPurchase += Number(r.total_purchase);
    if (due > 0) pendingCustomers++;
  }

  return { 
    totalDue, 
    totalCollected, 
    totalPaid: totalCollected, 
    totalPurchase, 
    pendingCustomers, 
    totalCustomers: data.length 
  };
}

export async function getRecentTransactions(shopId: string, limit = 10) {
  return supabase
    .from('ledger_entries')
    .select('id, amount, entry_type, description, created_at, customers(name, phone)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);
}
