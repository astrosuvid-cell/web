import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { notifyAdminOfEnquiry } from '@/lib/notifyAdmin';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service_type, message } = await request.json();

    if (!name?.trim() || !service_type?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, service type, and message are required' },
        { status: 400 }
      );
    }

    const enquiry = {
      name: name.trim(),
      email: email?.trim() || 'not-provided@astrosuvid.com',
      phone: phone?.trim() || 'Not provided',
      service_type: service_type.trim(),
      message: message.trim(),
    };

    const { data, error } = await supabaseAdmin
      .from('contact_responses')
      .insert({
        ...enquiry,
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

    try {
      await notifyAdminOfEnquiry({
        name: enquiry.name,
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        service_type: enquiry.service_type,
        message: enquiry.message,
      });
    } catch (notifyError) {
      console.error('Admin notification failed:', notifyError);
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
