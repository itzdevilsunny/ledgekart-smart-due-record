import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service role for admin ops
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Store OTP in database (Expires in 10 mins)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    const { error: dbError } = await supabaseAdmin
      .from('otps')
      .insert({ email, code: otp, expires_at: expiresAt });

    if (dbError) throw dbError;

    // 3. Send via Resend
    await resend.emails.send({
      from: 'LedgerKart <onboarding@resend.dev>', // Update this after verifying your domain
      to: email,
      subject: `${otp} is your LedgerKart verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6366f1;">LedgerKart</h2>
          <p>Hello,</p>
          <p>Your verification code for password reset is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; padding: 10px 0;">${otp}</div>
          <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
