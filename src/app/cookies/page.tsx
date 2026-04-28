import React from 'react';
import LegalPage from '@/components/LegalPage';

export default function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="April 29, 2026">
      <p>This Cookie Policy explains how LedgerKart uses cookies and similar technologies to recognize you when you visit our platform.</p>
      
      <h2>1. What are Cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for several reasons:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas (Admin and Customer portals).</li>
        <li><strong>Functionality Cookies:</strong> These are used to enhance the performance and functionality of our platform but are non-essential to their use. For example, remembering your role selection on the login page.</li>
        <li><strong>Analytics Cookies:</strong> These help us understand how our platform is being used, allowing us to improve the user experience.</li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>Our database and authentication partner, Supabase, may set cookies to manage your active session and ensure your data remains secure during your visit.</p>

      <h2>4. Managing Cookies</h2>
      <p>Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.</p>

      <h2>5. Updates to This Policy</h2>
      <p>We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.</p>
    </LegalPage>
  );
}
