import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    // Check if admin exists
    const { count } = await supabaseAdmin
      .from('admin_users')
      .select('id', { count: 'exact', head: true });

    if (count && count > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Insert default admin
    const { error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: 'admin@astrosuvid.com',
        password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // SHA256('admin123')
        name: 'Admin User',
        role: 'superadmin',
        is_active: true,
      });

    if (error) {
      console.error('Setup error:', error);
      return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Default admin created. Email: admin@astrosuvid.com, Password: admin123' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

