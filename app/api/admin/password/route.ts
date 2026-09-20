import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminRequest';
import { hashPassword, supabaseAdmin, verifyPassword } from '@/lib/supabaseServer';

export async function PUT(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from the current password' },
        { status: 400 }
      );
    }

    const { data: adminUser, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('id, password_hash')
      .eq('id', auth.userId)
      .eq('is_active', true)
      .single();

    if (fetchError || !adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, adminUser.password_hash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const { error: updateError } = await supabaseAdmin
      .from('admin_users')
      .update({
        password_hash: hashPassword(newPassword),
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminUser.id);

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Invalidate other sessions for security (keep current token)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('user_id', adminUser.id)
        .neq('token', token);
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
