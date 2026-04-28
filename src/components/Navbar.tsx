"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 2px 20px rgba(10,14,26,0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it Works</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>
        <div className="nav-ctas">
          <Link href="/login" className="btn-ghost">Login</Link>
          <Link href="/register?role=admin" className="btn-primary">Get Started →</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
