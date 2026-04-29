/**
 * Sends an email notification via the internal /api/notify endpoint.
 */
export async function sendNotification({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Notification failed:', data.error);
      return { error: data.error };
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown notification error';
    console.error('Notification error:', message);
    return { error: message };
  }
}

/**
 * Templates for different notification types.
 */
export const NotificationTemplates = {
  purchase: (shopName: string, customerName: string, amount: number, description: string) => ({
    subject: `New Purchase Recorded at ${shopName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #4f46e5;">New Purchase Recorded</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>A new purchase has been recorded in your ledger at <strong>${shopName}</strong>.</p>
        <div style="background: #f8fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Amount:</p>
          <p style="margin: 4px 0 16px; font-size: 24px; font-weight: bold; color: #1e293b;">₹${amount.toLocaleString('en-IN')}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Description:</p>
          <p style="margin: 4px 0 0; font-size: 16px; color: #1e293b;">${description}</p>
        </div>
        <p>You can view your complete ledger and make payments online through our customer portal.</p>
        <a href="${window.location.origin}/customer/portal" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">View Ledger</a>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">This is an automated notification from LedgerKart.</p>
      </div>
    `,
  }),
  payment: (shopName: string, customerName: string, amount: number) => ({
    subject: `Payment Received at ${shopName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #10b981;">Payment Received</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>We have successfully received your payment at <strong>${shopName}</strong>.</p>
        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #166534;">Amount Received:</p>
          <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: #14532d;">₹${amount.toLocaleString('en-IN')}</p>
        </div>
        <p>Your ledger balance has been updated accordingly. Thank you for your business!</p>
        <a href="${window.location.origin}/customer/portal" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">View Updated Ledger</a>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">This is an automated notification from LedgerKart.</p>
      </div>
    `,
  }),
};
