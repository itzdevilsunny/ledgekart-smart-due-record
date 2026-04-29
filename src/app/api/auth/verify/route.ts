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

    // 3. Find user and their role to determine redirect path
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = users.find(u => u.email === email);
    let role = user?.user_metadata?.role;

    // If role not in metadata, check if they exist in customers table
    if (!role) {
      const { data: customerRow } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      role = customerRow ? 'customer' : 'admin';
    }

    const redirectPath = role === 'customer' ? '/customer/portal' : '/admin/dashboard';
    
    // 4. Generate magic link with correct redirect
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const redirectTo = `${baseUrl}/auth/callback?redirect_to=${encodeURIComponent(redirectPath)}`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: { redirectTo }
    });

    if (linkError) throw linkError;

    return NextResponse.json({ 
      success: true, 
      redirectUrl: linkData.properties.action_link 
    });

  } catch (error: unknown) {
    console.error('OTP Verify Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
