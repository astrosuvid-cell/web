import SEOLayout from '@/components/SEOLayout';
import { PolicyList, PolicySection } from '@/components/legal/PolicySection';
import { buildLegalBusiness, LEGAL_LAST_UPDATED } from '@/lib/legal';
import { fetchSiteSettings } from '@/lib/siteSettingsServer';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Astro Suvid collects, uses, and protects your personal information for astrology consultations and online purchases.',
  path: '/privacy-policy',
});

export default async function PrivacyPolicy() {
  const legal = buildLegalBusiness(await fetchSiteSettings());
  return (
    <SEOLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy explains how we handle your personal data."
      content={
        <div className="space-y-12">
          <p className="text-sm text-muted-foreground">
            Last updated: {LEGAL_LAST_UPDATED} · Operated by {legal.name}
          </p>

          <PolicySection title="1. Introduction">
            <p>
              {legal.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates{' '}
              {legal.website} and provides Vedic astrology consultations, tarot readings,
              matrimonial services, and authentic gemstones through our Astromall store. This Privacy
              Policy describes how we collect, use, store, and protect your personal information when
              you visit our website, book a consultation, or make a purchase.
            </p>
            <p>
              By using our website or services, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>We may collect the following types of information:</p>
            <PolicyList
              items={[
                'Personal details: name, email address, phone number, and postal address',
                'Birth details: date, time, and place of birth (required for astrological consultations)',
                'Payment information: transaction IDs and payment status (processed securely via Razorpay; we do not store card or UPI credentials)',
                'Order details: products purchased, delivery address, and order history',
                'Communication data: messages sent through our contact form, WhatsApp, email, or phone',
                'Technical data: IP address, browser type, device information, and cookies for website functionality',
              ]}
            />
          </PolicySection>

          <PolicySection title="3. How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <PolicyList
              items={[
                'To provide astrology consultations, tarot readings, and related services',
                'To process and fulfil gemstone and product orders',
                'To communicate appointment confirmations, order updates, and customer support',
                'To process payments through our authorised payment gateway partner',
                'To improve our website, services, and user experience',
                'To comply with applicable laws and resolve disputes',
              ]}
            />
            <p>
              We do not sell, rent, or trade your personal information or birth details to third
              parties for marketing purposes.
            </p>
          </PolicySection>

          <PolicySection title="4. Payment Processing">
            <p>
              Online payments on our website are processed through Razorpay, a PCI-DSS compliant
              payment gateway. When you make a payment, your financial data is transmitted directly
              to Razorpay and is subject to Razorpay&apos;s privacy policy. We only receive
              confirmation of payment status and transaction references necessary to fulfil your
              order or booking.
            </p>
          </PolicySection>

          <PolicySection title="5. Data Sharing">
            <p>We may share your information only in the following circumstances:</p>
            <PolicyList
              items={[
                'With payment processors (e.g. Razorpay) to complete transactions',
                'With courier and logistics partners to deliver physical products',
                'With service providers who assist in website hosting and analytics (under confidentiality agreements)',
                'When required by law, court order, or government authority',
              ]}
            />
          </PolicySection>

          <PolicySection title="6. Data Security">
            <p>
              We implement reasonable technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. This
              includes secure HTTPS connections, access controls, and secure database storage.
              However, no method of transmission over the internet is 100% secure.
            </p>
          </PolicySection>

          <PolicySection title="7. Data Retention">
            <p>
              We retain your personal information for as long as necessary to provide our services,
              fulfil orders, comply with legal obligations, and resolve disputes. Consultation records
              and order history may be retained for up to 7 years for accounting and legal purposes.
            </p>
          </PolicySection>

          <PolicySection title="8. Cookies">
            <p>
              Our website uses cookies and similar technologies to remember your preferences, analyse
              traffic, and improve functionality. You can control cookies through your browser
              settings. Disabling cookies may affect certain features of the website.
            </p>
          </PolicySection>

          <PolicySection title="9. Your Rights">
            <p>You have the right to:</p>
            <PolicyList
              items={[
                'Request access to the personal data we hold about you',
                'Request correction of inaccurate or incomplete data',
                'Request deletion of your data, subject to legal and contractual obligations',
                'Withdraw consent for marketing communications at any time',
              ]}
            />
            <p>
              To exercise these rights, contact us at{' '}
              <a href={`mailto:${legal.email}`} className="text-primary hover:underline">
                {legal.email}
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection title="10. Children&apos;s Privacy">
            <p>
              Our services are not directed at individuals under 18 years of age. We do not
              knowingly collect personal information from children. If you believe we have collected
              data from a minor, please contact us immediately.
            </p>
          </PolicySection>

          <PolicySection title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date. Continued use of our website after changes
              constitutes acceptance of the updated policy.
            </p>
          </PolicySection>

          <PolicySection title="12. Contact Us">
            <p>For privacy-related questions or requests, contact:</p>
            <PolicyList
              items={[
                `${legal.name}`,
                `Email: ${legal.email}`,
                `Phone: ${legal.phoneDisplay}`,
                `Address: ${legal.address}`,
                `Website: ${legal.website}/contact`,
              ]}
            />
          </PolicySection>
        </div>
      }
    />
  );
}
