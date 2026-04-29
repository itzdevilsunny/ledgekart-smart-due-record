"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';


function OTPLoginForm() {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setStep(2);
      setMessage(`A 6-digit code has been sent to ${email}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(msg);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Redirect to the magic link which logs them in
      window.location.href = data.redirectUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo auth-logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </Link>

        <h1 className="auth-title">OTP Login / Reset</h1>
        <p className="auth-sub">
          {step === 1 
            ? 'Enter your email to receive a secure 6-digit login code.' 
            : `Enter the 6-digit code sent to ${email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            {error && <div className="auth-error">⚠️ {error}</div>}
            
            <div className="form-group">
              <label htmlFor="reset-email">Email Address</label>
              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Send OTP Code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            {error && <div className="auth-error">⚠️ {error}</div>}
            {message && <div className="auth-success-msg">✅ {message}</div>}

            <div className="form-group">
              <label htmlFor="otp-code">6-Digit Code</label>
              <input
                id="otp-code"
                className="otp-input"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Verify Code →'}
            </button>

            <button 
              type="button" 
              className="btn-ghost btn-full mt-12" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Try different email
            </button>
          </form>
        )}

        <p className="auth-switch">
          Prefer password? <Link href="/login">Back to Login</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-success-msg {
          color: var(--success);
          margin-bottom: 16px;
          font-size: 0.875rem;
        }
        .otp-input {
          text-align: center;
          font-size: 24px;
          letter-spacing: 8px;
        }
        .mt-12 { margin-top: 12px; }
      `}</style>
    </div>
  );
}
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <OTPLoginForm />
    </Suspense>
  );
}
