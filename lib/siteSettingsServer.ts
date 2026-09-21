import 'server-only';

import { unstable_cache } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
  type SiteSettings,
} from '@/lib/siteSettings';

async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('site_settings')
      .select('value')
      .eq('key', 'business')
      .maybeSingle();

    if (error) throw error;
    return normalizeSiteSettings(data?.value as Partial<SiteSettings> | undefined);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/** Cached for TTFB — settings rarely change. */
export const fetchSiteSettings = unstable_cache(loadSiteSettings, ['site-settings-business'], {
  revalidate: 300,
});

export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const normalized = normalizeSiteSettings(settings);
  const { data, error } = await getSupabaseAdmin()
    .from('site_settings')
    .upsert(
      {
        key: 'business',
        value: normalized,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    .select('value')
    .single();

  if (error) throw error;
  return normalizeSiteSettings(data?.value as Partial<SiteSettings>);
}
