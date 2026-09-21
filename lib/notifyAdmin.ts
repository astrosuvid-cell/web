import 'server-only';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'Astrosuvid@gmail.com';
const ADMIN_BCC = process.env.ADMIN_NOTIFY_BCC || 'shriyamparashar5@gmail.com';
const NTFY_SERVER = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/$/, '');
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'astrosuvid-enquiries-x9k2m4';

export interface EnquiryNotifyPayload {
  name: string;
  email?: string;
  phone?: string;
  service_type: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendAdminEmail(enquiry: EnquiryNotifyPayload): Promise<void> {
  const user = process.env.SMTP_USER || ADMIN_EMAIL;
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    console.warn(
      '[notifyAdmin] SMTP_PASS not set — email skipped. Add SMTP_USER / SMTP_PASS to .env.local'
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });

  const contactEmail = enquiry.email?.trim() || 'Not provided';
  const contactPhone = enquiry.phone?.trim() || 'Not provided';
  const subject = `New enquiry: ${enquiry.service_type} — ${enquiry.name}`;

  const text = [
    'New enquiry received on Astro Suvid',
    '',
    `Name: ${enquiry.name}`,
    `Email: ${contactEmail}`,
    `Phone: ${contactPhone}`,
    `Service: ${enquiry.service_type}`,
    '',
    'Message:',
    enquiry.message,
  ].join('\n');

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h2 style="margin:0 0 12px;font-size:22px">New enquiry — Astro Suvid</h2>
      <p style="margin:0 0 20px;color:#64748b">Someone submitted a form on the website.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#64748b;width:110px">Name</td><td style="padding:8px 0"><strong>${escapeHtml(enquiry.name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0">${escapeHtml(contactEmail)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Phone</td><td style="padding:8px 0">${escapeHtml(contactPhone)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Service</td><td style="padding:8px 0">${escapeHtml(enquiry.service_type)}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;white-space:pre-wrap;line-height:1.5">${escapeHtml(enquiry.message)}</div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Astro Suvid Enquiries" <${user}>`,
    to: ADMIN_EMAIL,
    bcc: ADMIN_BCC,
    replyTo: enquiry.email?.trim() || undefined,
    subject,
    text,
    html,
  });
}

/** Free phone push via ntfy.sh — no signup. Subscribe to NTFY_TOPIC in the ntfy app. */
async function sendNtfy(enquiry: EnquiryNotifyPayload): Promise<void> {
  if (process.env.NTFY_ENABLED === 'false') {
    return;
  }

  const contactPhone = enquiry.phone?.trim() || 'N/A';
  const title = `New enquiry: ${enquiry.service_type}`;
  const body = [
    `${enquiry.name} · ${contactPhone}`,
    enquiry.message.slice(0, 280),
  ].join('\n');

  const headers: Record<string, string> = {
    Title: title,
    Priority: 'high',
    Tags: 'envelope,astro',
    'Content-Type': 'text/plain; charset=utf-8',
  };

  if (process.env.NTFY_TOKEN) {
    headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;
  }

  const res = await fetch(`${NTFY_SERVER}/${NTFY_TOPIC}`, {
    method: 'POST',
    headers,
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`ntfy failed (${res.status}): ${detail}`);
  }
}

/**
 * Notify admin on enquiry (email + ntfy). Failures are logged only —
 * the enquiry DB save must not fail because of notifications.
 */
export async function notifyAdminOfEnquiry(enquiry: EnquiryNotifyPayload): Promise<void> {
  const results = await Promise.allSettled([sendAdminEmail(enquiry), sendNtfy(enquiry)]);

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      const channel = i === 0 ? 'email' : 'ntfy';
      console.error(`[notifyAdmin] ${channel} failed:`, result.reason);
    }
  });
}
