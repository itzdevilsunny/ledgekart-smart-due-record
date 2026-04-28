import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo logo-white">
              <div className="logo-icon">L</div>
              LedgerKart
            </Link>
            <p>Smart due record management for local shops. Replace your paper khata with a powerful digital system.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="#features">Features</Link>
            <Link href="#how">How it Works</Link>
            <Link href="/login?role=admin">Live Demo</Link>
            <Link href="/register?role=admin">Start Free</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link href="#">Help Center</Link>
            <Link href="#">Contact Us</Link>
            <Link href="#">WhatsApp Support</Link>
            <Link href="#">Status</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <Link href="/refund">Refund Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 LedgerKart. Made with ♥ for Indian Shopkeepers.</p>
          <div className="social-icons">
            <a className="soc-btn" href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a className="soc-btn" href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a className="soc-btn" href="#" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
