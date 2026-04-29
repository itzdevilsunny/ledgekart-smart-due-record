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
    const role = user?.user_metadata?.role || 'admin';
    const redirectPath = role === 'customer' ? '/customer/portal' : '/admin/dashboard';
    
    // 4. Generate magic link with correct redirect
    // We append the redirect_to parameter to ensure they land in the right portal
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) throw linkError;

    // Supabase generateLink returns a link that defaults to site_url. 
    // We'll manually append the redirect_to to the action_link if needed, 
    // or just return the path for the frontend to handle if it prefers.
    
    // Most reliable: return the success and let the frontend do the final push 
    // after the magic link session is established. 
    // But action_link is meant to be clicked/visited.
    
    let finalLink = linkData.properties.action_link;
    if (finalLink && !finalLink.includes('redirect_to')) {
      const separator = finalLink.includes('?') ? '&' : '?';
      finalLink += `${separator}redirect_to=${encodeURIComponent(redirectPath)}`;
    }

    return NextResponse.json({ 
      success: true, 
      redirectUrl: finalLink 
    });

  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
