import SEOLayout from '@/components/SEOLayout';
import { PolicyList, PolicySection } from '@/components/legal/PolicySection';
import { buildLegalBusiness, LEGAL_LAST_UPDATED } from '@/lib/legal';
import { fetchSiteSettings } from '@/lib/siteSettingsServer';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cancellation & Refund Policy',
  description:
    'Cancellation and refund policy for Astro Suvid astrology consultations and Astromall gemstone orders.',
  path: '/cancellation-refund',
});

export default async function CancellationRefundPolicy() {
  const legal = buildLegalBusiness(await fetchSiteSettings());
  return (
    <SEOLayout
      title="Cancellation & Refund Policy"
      description="Clear guidelines on cancellations, refunds, and how to request them."
      content={
        <div className="space-y-12">
          <p className="text-sm text-muted-foreground">
            Last updated: {LEGAL_LAST_UPDATED} · Operated by {legal.name}
          </p>

          <PolicySection title="1. Overview">
            <p>
              At {legal.name}, we strive to provide satisfactory astrology consultations
              and quality gemstones. This policy outlines the conditions under which cancellations
              and refunds are accepted for our services and products.
            </p>
          </PolicySection>

          <PolicySection title="2. Consultation Services">
            <p>
              <strong className="text-foreground">Cancellation before the session:</strong>
            </p>
            <PolicyList
              items={[
                'Cancellations made at least 24 hours before the scheduled appointment receive a full refund.',
                'Cancellations made within 24 hours of the appointment may incur a 25% cancellation fee.',
                'No-shows without prior notice are not eligible for a refund.',
              ]}
            />
            <p>
              <strong className="text-foreground">After the session:</strong>
            </p>
            <PolicyList
              items={[
                'Consultation fees are non-refundable once the session has been conducted, as the service has been fully delivered.',
                'If you are dissatisfied with a consultation, contact us within 48 hours. We will review your concern and may offer a partial credit or follow-up session at our discretion.',
              ]}
            />
          </PolicySection>

          <PolicySection title="3. Astromall Product Orders">
            <p>
              <strong className="text-foreground">Before dispatch:</strong>
            </p>
            <PolicyList
              items={[
                'Orders can be cancelled free of charge before the product has been shipped.',
                'A full refund will be processed within 5–7 business days to the original payment method.',
              ]}
            />
            <p>
              <strong className="text-foreground">After dispatch / delivery:</strong>
            </p>
            <PolicyList
              items={[
                'Returns are accepted within 7 days of delivery for unused, undamaged products in original packaging with certification.',
                'Customised or energised gemstones may not be eligible for return unless defective or incorrectly shipped.',
                'Return shipping costs are borne by the customer unless the return is due to our error (wrong item, damaged product).',
                'Refunds for approved returns are processed within 7–10 business days after we receive and inspect the returned item.',
              ]}
            />
          </PolicySection>

          <PolicySection title="4. Defective or Incorrect Products">
            <p>
              If you receive a damaged, defective, or incorrect product, contact us within 48 hours
              of delivery with photos and your order details. We will arrange a replacement or full
              refund at no additional cost, including return shipping where applicable.
            </p>
          </PolicySection>

          <PolicySection title="5. Refund Processing">
            <p>
              Approved refunds are credited to the original payment method used during purchase.
              Refund timelines depend on your bank or payment provider and typically take 5–10
              business days after processing. UPI and wallet refunds may be faster. We will send
              you a confirmation email once the refund is initiated.
            </p>
          </PolicySection>

          <PolicySection title="6. Non-Refundable Items">
            <PolicyList
              items={[
                'Completed astrology or tarot consultations',
                'Digital reports or horoscope documents already delivered',
                'Products returned without original packaging or certification',
                'Products damaged due to customer mishandling',
                'Promotional or discounted items marked as non-refundable at the time of purchase',
              ]}
            />
          </PolicySection>

          <PolicySection title="7. How to Request a Cancellation or Refund">
            <p>To request a cancellation or refund, contact us with your order or booking details:</p>
            <PolicyList
              items={[
                `Email: ${legal.email} (subject: Cancellation/Refund Request)`,
                `Phone / WhatsApp: ${legal.phoneDisplay}`,
                `Contact form: ${legal.website}/contact`,
              ]}
            />
            <p>Please include your full name, order/booking ID, date of purchase, and reason for the request. We aim to respond within 1–2 business days.</p>
          </PolicySection>

          <PolicySection title="8. Disputes">
            <p>
              If you are unable to resolve a refund issue with us directly, you may escalate
              through your payment provider. For Razorpay transactions, you may also contact
              Razorpay support with your transaction ID.
            </p>
          </PolicySection>
        </div>
      }
    />
  );
}
