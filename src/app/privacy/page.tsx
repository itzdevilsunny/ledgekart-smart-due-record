import React from 'react';
import LegalPage from '@/components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="April 29, 2026">
      <p>At LedgerKart, we are committed to protecting the privacy and security of your shop&apos;s data and your customers&apos; personal information. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
      
      <h2>1. Information We Collect</h2>
      <p>We collect information that you provide directly to us when you create an account or use our services:</p>
      <ul>
        <li><strong>Shopkeeper Information:</strong> Name, email address, phone number, and shop name.</li>
        <li><strong>Customer Information:</strong> Names and phone numbers of the customers you add to your ledger.</li>
        <li><strong>Transaction Data:</strong> Details of dues, payments, and purchase history recorded in the system.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our platform for performance and security purposes.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li>To provide and maintain the LedgerKart service.</li>
        <li>To send automated payment reminders via WhatsApp and SMS on your behalf.</li>
        <li>To generate monthly PDF khata reports for your records.</li>
        <li>To enable customers to view their own due balances via their secure portal.</li>
        <li>To provide customer support and improve our application.</li>
      </ul>

      <h2>3. Data Sharing and Security</h2>
      <p>We do not sell your data or your customers&apos; data to third parties. Data is shared only with essential service providers like Supabase (database) and WhatsApp/SMS gateways for the sole purpose of delivering the service. We implement industry-standard encryption to protect all sensitive information.</p>

      <h2>4. Your Rights</h2>
      <p>You have the right to access, update, or delete your account and associated data at any time. If you choose to delete your account, all shop and customer records will be permanently removed from our active databases.</p>

      <h2>5. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at support@ledgerkart.com.</p>
    </LegalPage>
  );
}
