import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // 1. Check if OTP is valid and not expired
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    // 2. OTP is valid! Cleanup codes for this email
    await supabaseAdmin.from('otps').delete().eq('email', email);

    // 3. Since we verified the user, we can now generate a temporary reset link 
    // or simply return success so the frontend can allow password update.
    // However, to actually UPDATE the password in Supabase Auth, 
    // the user needs to be authenticated.
    
    // We'll create a magic link that logs them in directly so they can update their password.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) throw linkError;

    return NextResponse.json({ 
      success: true, 
      redirectUrl: linkData.properties.action_link 
    });

  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
