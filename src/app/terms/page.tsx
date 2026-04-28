import React from 'react';
import LegalPage from '@/components/LegalPage';

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="April 29, 2026">
      <p>Welcome to LedgerKart. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing LedgerKart, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

      <h2>2. User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. LedgerKart is not liable for any loss or damage arising from your failure to protect your login information.</p>

      <h2>3. Permitted Use</h2>
      <p>You agree to use LedgerKart only for lawful business purposes. You must not:</p>
      <ul>
        <li>Use the service to track illegal transactions.</li>
        <li>Send unsolicited or harassing messages via our WhatsApp reminder feature.</li>
        <li>Attempt to bypass any security measures or reverse-engineer the platform.</li>
      </ul>

      <h2>4. WhatsApp & SMS Reminders</h2>
      <p>By enabling automated reminders, you confirm that you have the consent of your customers to send them transaction-related messages. LedgerKart acts as a processor and is not responsible for any disputes regarding the content or frequency of these messages.</p>

      <h2>5. Limitation of Liability</h2>
      <p>LedgerKart provides the service &quot;as is.&quot; While we strive for 100% accuracy, we are not responsible for financial losses resulting from incorrect data entry by the user or temporary service interruptions.</p>

      <h2>6. Modifications</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the service after changes are posted constitutes your acceptance of the new terms.</p>
    </LegalPage>
  );
}
