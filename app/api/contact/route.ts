import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service_type, message } = await request.json();

    if (!name?.trim() || !service_type?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, service type, and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_responses')
      .insert({
        name: name.trim(),
        email: email?.trim() || 'not-provided@astrosuvid.com',
        phone: phone?.trim() || 'Not provided',
        service_type: service_type.trim(),
        message: message.trim(),
        status: 'new',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. We will respond within 24 hours.',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
