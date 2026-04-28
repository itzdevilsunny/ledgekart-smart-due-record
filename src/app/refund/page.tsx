import React from 'react';
import LegalPage from '@/components/LegalPage';

export default function RefundPolicy() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="April 29, 2026">
      <p>Thank you for choosing LedgerKart. We want to ensure you are 100% satisfied with our service.</p>
      
      <h2>1. 7-Day Money-Back Guarantee</h2>
      <p>If you are not satisfied with LedgerKart Premium for any reason, you are eligible for a full refund within the first 7 days of your initial subscription. Simply contact our support team to initiate the process.</p>

      <h2>2. Cancellation</h2>
      <p>You can cancel your subscription at any time through your Admin Dashboard. Upon cancellation, you will continue to have access to the premium features until the end of your current billing period. No further charges will be made to your account.</p>

      <h2>3. Prorated Refunds</h2>
      <p>Outside of the 7-day guarantee period, we do not generally offer prorated refunds for mid-month cancellations. However, we may make exceptions in cases of technical failure on our end that prevented you from using the service.</p>

      <h2>4. Refund Processing</h2>
      <p>Once a refund is approved, it will be processed and automatically applied to your original method of payment within 5-10 business days.</p>

      <h2>5. Questions?</h2>
      <p>If you have any questions regarding our refund policy, please reach out to billing@ledgerkart.com and our team will be happy to assist you.</p>
    </LegalPage>
  );
}
