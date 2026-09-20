import SEOLayout from '@/components/SEOLayout';
import { PolicyList, PolicySection } from '@/components/legal/PolicySection';
import { buildLegalBusiness, LEGAL_LAST_UPDATED } from '@/lib/legal';
import { fetchSiteSettings } from '@/lib/siteSettingsServer';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Shipping & Delivery Policy',
  description:
    'Shipping, delivery timelines, and tracking information for Astro Suvid Astromall gemstone orders across India.',
  path: '/shipping-delivery',
});

export default async function ShippingDeliveryPolicy() {
  const legal = buildLegalBusiness(await fetchSiteSettings());
  return (
    <SEOLayout
      title="Shipping & Delivery Policy"
      description="How we pack, ship, and deliver your Astromall orders safely across India."
      content={
        <div className="space-y-12">
          <p className="text-sm text-muted-foreground">
            Last updated: {LEGAL_LAST_UPDATED} · Operated by {legal.name}
          </p>

          <PolicySection title="1. Scope">
            <p>
              This Shipping &amp; Delivery Policy applies to physical products purchased through
              Astromall on {legal.website}, including gemstones, rudraksha, yantras, and
              related spiritual products. Astrology consultations and digital services are delivered
              online or in person and are not covered by physical shipping terms.
            </p>
          </PolicySection>

          <PolicySection title="2. Delivery Locations">
            <p>
              We currently ship to all serviceable pin codes across India. International shipping is
              not available at this time. For bulk or special delivery requests, contact us before
              placing your order.
            </p>
          </PolicySection>

          <PolicySection title="3. Order Processing">
            <PolicyList
              items={[
                'Orders are processed within 1–2 business days after payment confirmation.',
                'Orders placed on weekends or public holidays are processed on the next business day.',
                'You will receive an order confirmation email/SMS with your order ID upon successful payment.',
                'A shipping confirmation with tracking details is sent once your order is dispatched.',
              ]}
            />
          </PolicySection>

          <PolicySection title="4. Delivery Timelines">
            <p>Estimated delivery times from dispatch:</p>
            <PolicyList
              items={[
                'Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune): 3–5 business days',
                'Tier 2 cities and state capitals: 5–7 business days',
                'Other locations across India: 7–10 business days',
              ]}
            />
            <p>
              Delivery timelines are estimates and may vary due to courier delays, weather,
              festivals, or remote location accessibility. We are not liable for delays caused by
              third-party logistics partners beyond our control.
            </p>
          </PolicySection>

          <PolicySection title="5. Shipping Charges">
            <p>
              Shipping charges, if applicable, are displayed at checkout before payment. Free
              shipping may be offered on orders above a specified value or during promotional
              periods. Any applicable shipping fee is non-refundable unless the order is cancelled
              before dispatch or returned due to our error.
            </p>
          </PolicySection>

          <PolicySection title="6. Packaging">
            <p>
              All gemstones and spiritual products are carefully packed in secure, tamper-evident
              packaging. Lab certification documents are included with gemstone orders. High-value
              items may be shipped with additional insurance and signature confirmation where
              available.
            </p>
          </PolicySection>

          <PolicySection title="7. Tracking Your Order">
            <p>
              Once dispatched, you will receive a tracking number via email or SMS. You can track
              your shipment on the courier partner&apos;s website. For tracking assistance, contact
              us with your order ID.
            </p>
          </PolicySection>

          <PolicySection title="8. Delivery Attempts & Failed Delivery">
            <PolicyList
              items={[
                'Courier partners typically make 2–3 delivery attempts.',
                'If delivery fails due to an incorrect address or unavailability, the package may be returned to us.',
                'Re-shipping charges may apply for orders returned due to incorrect address provided by the customer.',
                'Please ensure your delivery address and phone number are accurate at checkout.',
              ]}
            />
          </PolicySection>

          <PolicySection title="9. Damaged or Lost Shipments">
            <p>
              If your package arrives damaged or is lost in transit, contact us within 48 hours of
              the expected delivery date (or upon receiving a damaged package) with photos and your
              order details. We will work with the courier to investigate and arrange a replacement
              or refund as appropriate.
            </p>
          </PolicySection>

          <PolicySection title="10. Address Changes">
            <p>
              Address changes can only be accommodated before the order is dispatched. Contact us
              immediately at {legal.email} or {legal.phoneDisplay} with your
              order ID if you need to update your delivery address.
            </p>
          </PolicySection>

          <PolicySection title="11. Contact Us">
            <p>For shipping and delivery enquiries:</p>
            <PolicyList
              items={[
                `Email: ${legal.email}`,
                `Phone / WhatsApp: ${legal.phoneDisplay}`,
                `Address: ${legal.address}`,
                `Business hours: ${legal.hours}`,
                `Contact page: ${legal.website}/contact`,
              ]}
            />
          </PolicySection>
        </div>
      }
    />
  );
}
