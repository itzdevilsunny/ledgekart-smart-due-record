"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Debug fetch issues
    const originalFetch = typeof window !== 'undefined' ? window.fetch : null;
    if (originalFetch) {
      window.fetch = function(...args) {
        if (args[0] && args[0].toString().includes('supabase.co')) {
          console.log('--- SUPABASE FETCH ---', args[0]);
        }
        return originalFetch.apply(this, args);
      };
    }

    const handleAuth = async () => {
      try {
        // 1. Check for error in URL
        const errorMsg = searchParams.get('error_description') || searchParams.get('error');
        if (errorMsg) {
          setError(errorMsg);
          return;
        }

        // 2. Try explicit code exchange if 'code' is in URL (PKCE)
        const code = searchParams.get('code');
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          if (data.session && mounted) {
            processSession(data.session);
            return;
          }
        }

        // 3. Try immediate session check (Hash/Implicit flow)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session && mounted) {
          processSession(session);
          return;
        }

        // 4. Wait for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session && mounted) {
            processSession(session);
            subscription.unsubscribe();
          }
        });

        // 5. Timeout after 15 seconds
        const timeout = setTimeout(() => {
          if (mounted && !error) {
            setError("Authentication timed out. No session could be established.");
          }
        }, 15000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch (err: unknown) {
        if (mounted) {
          const message = err instanceof Error ? err.message : "An unexpected error occurred during login.";
          console.error("Auth Callback Error:", err);
          setError(message);
        }
      }
    };

    const processSession = (session: Session) => {
      const next = searchParams.get('redirect_to');
      if (next) {
        router.push(next);
      } else {
        const role = session.user.user_metadata?.role || 'admin';
        router.push(role === 'customer' ? '/customer/portal' : '/admin/dashboard');
      }
    };

    handleAuth();
    return () => { mounted = false; };
  }, [router, searchParams, error]);

  return (
    <div className="callback-page">
      <div className="callback-card">
        {error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Login Failed</h2>
            <p className="error-text">{error}</p>
            
            {error.includes('Failed to fetch') && (
              <div className="troubleshoot-box mt-24">
                <p><strong>Troubleshooting:</strong></p>
                <ul>
                  <li>Check your internet connection.</li>
                  <li>Verify if Supabase is reachable from your browser.</li>
                  <li>Ensure your Supabase project is not paused.</li>
                </ul>
              </div>
            )}

            <div className="flex-col-gap mt-24">
              <button onClick={() => window.location.reload()} className="btn-primary">Retry Login</button>
              <button onClick={() => router.push('/login')} className="btn-ghost">Back to Login</button>
            </div>
          </div>
        ) : (
          <>
            <div className="spinner-container">
              <div className="spinner" />
            </div>
            <h2>Setting up your session...</h2>
            <p>Please wait while we securely log you in.</p>
          </>
        )}
      </div>

      <style jsx>{`
        .error-container { animation: fadeIn 0.3s ease; }
        .error-icon { font-size: 3rem; margin-bottom: 16px; }
        .error-text { color: #ef4444; margin-bottom: 8px; font-weight: 500; }
        .troubleshoot-box {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          padding: 16px;
          border-radius: 12px;
          text-align: left;
          font-size: 0.9rem;
        }
        .troubleshoot-box ul { margin: 8px 0 0 20px; padding: 0; }
        .troubleshoot-box li { color: #991b1b; margin-bottom: 4px; }
        .mt-24 { margin-top: 24px; }
        .callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
        }
        .callback-card {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 24px;
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          width: 90%;
        }
        .spinner-container {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top: 4px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        p {
          color: var(--text-muted);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
