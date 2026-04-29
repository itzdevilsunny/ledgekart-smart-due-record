"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/utils/supabase';

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/customers', icon: '👥', label: 'Customers' },
  { href: '/admin/ledger', icon: '📒', label: 'Ledger' },
  { href: '/admin/products', icon: '📦', label: 'Products' },
  { href: '/admin/reports', icon: '📈', label: 'Reports' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, shop } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="admin-layout-top">
      <header className="admin-header">
        <div className="header-inner">
          <div className="header-left">
            <Link href="/" className="header-logo main-logo-link">
              <div className="logo-icon-sm">L</div>
              <span className="hide-mobile">LedgerKart</span>
            </Link>
            <div className="header-divider" />
            <div className="header-shop-info hide-mobile">
              <span className="font-700">{shop?.name || 'My Shop'}</span>
            </div>
          </div>

          <nav className="header-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="header-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-right">
            <div className="header-profile" onClick={() => router.push('/admin/settings')}>
              <div className="header-avatar">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
              <span className="header-username">{profile?.full_name?.split(' ')[0] || 'Admin'}</span>
            </div>
            <button className="btn-icon" onClick={handleSignOut} title="Sign Out">🚪</button>
          </div>
        </div>
      </header>

      <div className="nav-floating-dock dock-elevated">
        <button className="btn-3d" onClick={() => router.back()} title="Go Back">←</button>
        <button className="btn-3d" onClick={() => router.forward()} title="Go Forward">→</button>
        <Link href="/admin/dashboard" className="btn-3d btn-3d-home home-dock-link" title="Dashboard Home">
          <span>🏠</span>
        </Link>
      </div>

      <style jsx>{`
        .main-logo-link { cursor: pointer; z-index: 1001; }
        .dock-elevated { z-index: 9999; }
        .home-dock-link { text-decoration: none; }
      `}</style>

      <main className="admin-content">
        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
}
