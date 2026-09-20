export interface SiteSocialLinks {
  instagram: string;
  youtube: string;
  facebook: string;
}

export interface SiteSettings {
  phone: string;
  phoneDisplay: string;
  email: string;
  supportEmail: string;
  addressLine: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  hours: string;
  social: SiteSocialLinks;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '+919999999999',
  phoneDisplay: '+91 99999 99999',
  email: 'hello@astrosuvid.com',
  supportEmail: 'support@astrosuvid.com',
  addressLine: 'Lucknow, Uttar Pradesh 226001, India',
  streetAddress: 'Lucknow',
  addressLocality: 'Lucknow',
  addressRegion: 'Uttar Pradesh',
  postalCode: '226001',
  addressCountry: 'IN',
  hours: 'Monday to Sunday, 10:00 AM – 8:00 PM IST',
  social: {
    instagram: '',
    youtube: '',
    facebook: '',
  },
};

export function normalizeSiteSettings(raw: Partial<SiteSettings> | null | undefined): SiteSettings {
  const social = raw?.social ?? {};
  return {
    phone: raw?.phone?.trim() || DEFAULT_SITE_SETTINGS.phone,
    phoneDisplay: raw?.phoneDisplay?.trim() || DEFAULT_SITE_SETTINGS.phoneDisplay,
    email: raw?.email?.trim() || DEFAULT_SITE_SETTINGS.email,
    supportEmail: raw?.supportEmail?.trim() || DEFAULT_SITE_SETTINGS.supportEmail,
    addressLine: raw?.addressLine?.trim() || DEFAULT_SITE_SETTINGS.addressLine,
    streetAddress: raw?.streetAddress?.trim() || DEFAULT_SITE_SETTINGS.streetAddress,
    addressLocality: raw?.addressLocality?.trim() || DEFAULT_SITE_SETTINGS.addressLocality,
    addressRegion: raw?.addressRegion?.trim() || DEFAULT_SITE_SETTINGS.addressRegion,
    postalCode: raw?.postalCode?.trim() || DEFAULT_SITE_SETTINGS.postalCode,
    addressCountry: raw?.addressCountry?.trim() || DEFAULT_SITE_SETTINGS.addressCountry,
    hours: raw?.hours?.trim() || DEFAULT_SITE_SETTINGS.hours,
    social: {
      instagram: social.instagram?.trim() || '',
      youtube: social.youtube?.trim() || '',
      facebook: social.facebook?.trim() || '',
    },
  };
}

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function telHref(phone: string): string {
  const digits = phoneDigits(phone);
  return digits ? `tel:+${digits.replace(/^0+/, '')}` : 'tel:+919999999999';
}

export function whatsappHref(phone: string, message?: string): string {
  const digits = phoneDigits(phone);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function formatDurationLabel(minutes: number | null | undefined, fallback?: string | null): string | null {
  if (minutes != null && minutes > 0) return `${minutes} min`;
  return fallback?.trim() || null;
}

export function formatServicePrice(price: number | null | undefined): string | null {
  if (price == null || Number.isNaN(price)) return null;
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function formatServicePricing(
  price: number | null | undefined,
  durationMinutes: number | null | undefined,
  durationFallback?: string | null
): string | null {
  const priceLabel = formatServicePrice(price);
  const durationLabel = formatDurationLabel(durationMinutes, durationFallback);
  if (!priceLabel) return null;
  if (durationLabel) return `${priceLabel} / ${durationLabel}`;
  return priceLabel;
}
