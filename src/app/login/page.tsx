"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signUp } from '@/utils/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') ?? 'admin';
  const isAdmin = role === 'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message.includes('Invalid') 
        ? 'Invalid email or password. Do you need to register first?' 
        : authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push(isAdmin ? '/admin/dashboard' : '/customer/portal');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      setError('System is still using placeholder keys. Please add real Supabase keys to Vercel Settings.');
      setLoading(false);
      return;
    }

    const demoEmail = isAdmin ? 'admin@demo.com' : 'customer@demo.com';
    const demoPass = 'demo1234';

    // Try signing in
    const { error: signInError } = await signIn(demoEmail, demoPass);

    if (signInError) {
      // If fails (account doesn't exist), try signing up
      const { error: signUpError } = await signUp(
        demoEmail, 
        demoPass, 
        isAdmin ? 'Demo Admin' : 'Demo Customer', 
        isAdmin ? '0000000000' : '1111111111', 
        role as 'admin' | 'customer'
      );

      if (signUpError) {
        setError(`Demo setup failed: ${signUpError.message}. (Tip: Disable "Email Confirmation" in Supabase Dashboard)`);
        setLoading(false);
        return;
      }
      
      // After signup, sign in again
      const { error: finalError } = await signIn(demoEmail, demoPass);
      if (finalError) {
        setError(`Sign in failed after signup: ${finalError.message}`);
        setLoading(false);
        return;
      }
    }

    router.push(isAdmin ? '/admin/dashboard' : '/customer/portal');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo auth-logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </Link>

        <div className="role-toggle">
          <Link href="/login?role=admin" className={`role-tab ${isAdmin ? 'active' : ''}`}>
            🏪 Admin Login
          </Link>
          <Link href="/login?role=customer" className={`role-tab ${!isAdmin ? 'active' : ''}`}>
            👤 Customer Login
          </Link>
        </div>

        <h1 className="auth-title">{isAdmin ? 'Shop Owner Login' : 'Customer Login'}</h1>
        <p className="auth-sub">
          {isAdmin
            ? 'Sign in to manage your shop, customers and dues'
            : 'Sign in to view your balance and payment history'}
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading
              ? <><span className="btn-spinner" /> Signing in…</>
              : `Sign In as ${isAdmin ? 'Admin' : 'Customer'} →`}
          </button>

          <button 
            type="button" 
            onClick={handleDemoLogin} 
            className="btn-outline btn-full mt-12" 
            disabled={loading}
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            ✨ One-Click Demo Access
          </button>
        </form>

        {isAdmin ? (
          <p className="auth-switch">
            Don&apos;t have a shop?{' '}
            <Link href="/register?role=admin">Register Your Shop Free →</Link>
          </p>
        ) : (
          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link href="/register?role=customer">Create Customer Account →</Link>
          </p>
        )}
        
        <p className="auth-switch mt-12">
          {isAdmin ? (
            <>Are you a customer? <Link href="/login?role=customer">Customer Login</Link></>
          ) : (
            <>Are you a shop owner? <Link href="/login?role=admin">Admin Login</Link></>
          )}
        </p>

        <div className="auth-divider"><span>or</span></div>
        <Link href="/" className="btn-ghost btn-full-center">← Back to Home</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card"><div className="spinner" /></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
