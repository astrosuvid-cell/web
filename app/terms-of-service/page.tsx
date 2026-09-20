import SEOLayout from '@/components/SEOLayout';
import { PolicyList, PolicySection } from '@/components/legal/PolicySection';
import { buildLegalBusiness, LEGAL_LAST_UPDATED } from '@/lib/legal';
import { fetchSiteSettings } from '@/lib/siteSettingsServer';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for using Astro Suvid astrology consultations, tarot readings, and Astromall gemstone purchases.',
  path: '/terms-of-service',
});

export default async function TermsOfService() {
  const legal = buildLegalBusiness(await fetchSiteSettings());
  return (
    <SEOLayout
      title="Terms & Conditions"
      description="Please read these terms carefully before using our website or purchasing our services."
      content={
        <div className="space-y-12">
          <p className="text-sm text-muted-foreground">
            Last updated: {LEGAL_LAST_UPDATED} · Operated by {legal.name}
          </p>

          <PolicySection title="1. Acceptance of Terms">
            <p>
              By accessing {legal.website}, booking a consultation, or placing an order,
              you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do
              not use our website or services.
            </p>
          </PolicySection>

          <PolicySection title="2. About Our Services">
            <p>{legal.name} provides:</p>
            <PolicyList
              items={[
                'Vedic astrology consultations (birth chart analysis, dasha predictions, remedial guidance)',
                'Tarot card readings and numerology services',
                'Kundli matching and matrimonial services',
                'Vastu consultation for homes and offices',
                'Lab-certified gemstones and spiritual products via Astromall',
              ]}
            />
            <p>
              All astrological and tarot readings are intended for spiritual guidance and
              entertainment purposes only. They do not constitute medical, legal, financial, or
              professional advice. You are solely responsible for decisions made based on our
              readings.
            </p>
          </PolicySection>

          <PolicySection title="3. User Responsibilities">
            <p>When using our services, you agree to:</p>
            <PolicyList
              items={[
                'Provide accurate birth details, contact information, and delivery addresses',
                'Use our services only for lawful personal purposes',
                'Not reproduce, distribute, or commercially exploit our readings or website content without permission',
                'Treat our consultants and staff with respect during all interactions',
              ]}
            />
          </PolicySection>

          <PolicySection title="4. Bookings & Consultations">
            <p>
              Consultation appointments are confirmed upon receipt of payment or as agreed at the
              time of booking. Sessions may be conducted in person at our Lucknow office or online
              via phone, video call, or WhatsApp. You must be available at the scheduled time.
              Rescheduling is subject to our Cancellation &amp; Refund Policy.
            </p>
          </PolicySection>

          <PolicySection title="5. Payments">
            <p>
              All prices are listed in Indian Rupees (INR) unless stated otherwise. Payments are
              processed securely through Razorpay. By making a payment, you authorise us to charge
              the specified amount for the selected service or product. We reserve the right to
              modify pricing at any time; changes will not affect confirmed orders.
            </p>
          </PolicySection>

          <PolicySection title="6. Product Orders (Astromall)">
            <p>
              Gemstone and product orders are subject to availability. Product images are
              representative; natural gemstones may vary slightly in colour and appearance. All
              gemstones sold are lab-certified as stated on the product page. Delivery timelines
              are covered in our Shipping &amp; Delivery Policy.
            </p>
          </PolicySection>

          <PolicySection title="7. Cancellations & Refunds">
            <p>
              Cancellation and refund terms vary by service type and are detailed in our{' '}
              <a href="/cancellation-refund" className="text-primary hover:underline">
                Cancellation &amp; Refund Policy
              </a>
              . Please review that policy before making a purchase.
            </p>
          </PolicySection>

          <PolicySection title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, {legal.name} shall not be liable for
              any indirect, incidental, or consequential damages arising from the use of our
              services or products. Our total liability for any claim shall not exceed the amount
              paid by you for the specific service or product in question.
            </p>
          </PolicySection>

          <PolicySection title="9. Intellectual Property">
            <p>
              All content on this website — including text, graphics, logos, readings, and
              analysis — is the intellectual property of {legal.name} and is protected by
              applicable copyright laws. Unauthorised use is prohibited.
            </p>
          </PolicySection>

          <PolicySection title="10. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the content or privacy practices of external sites. Accessing third-party links is at
              your own risk.
            </p>
          </PolicySection>

          <PolicySection title="11. Governing Law">
            <p>
              These Terms &amp; Conditions are governed by the laws of India. Any disputes shall
              be subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.
            </p>
          </PolicySection>

          <PolicySection title="12. Changes to Terms">
            <p>
              We reserve the right to modify these terms at any time. Updated terms will be posted
              on this page. Continued use of our website constitutes acceptance of revised terms.
            </p>
          </PolicySection>

          <PolicySection title="13. Contact Us">
            <p>For questions about these terms, contact:</p>
            <PolicyList
              items={[
                `Email: ${legal.email}`,
                `Phone: ${legal.phoneDisplay}`,
                `Address: ${legal.address}`,
                `Hours: ${legal.hours}`,
              ]}
            />
          </PolicySection>
        </div>
      }
    />
  );
}
