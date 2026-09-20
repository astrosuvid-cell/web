-- Site-wide business contact settings (editable from admin)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (key, value)
VALUES (
  'business',
  '{
    "phone": "+919198969988",
    "phoneDisplay": "+91 91989 69988",
    "email": "Astrosuvid@gmail.com",
    "supportEmail": "Astrosuvid@gmail.com",
    "addressLine": "Lucknow, Uttar Pradesh 226001, India",
    "streetAddress": "Lucknow",
    "addressLocality": "Lucknow",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "226001",
    "addressCountry": "IN",
    "hours": "Monday to Sunday, 10:00 AM – 8:00 PM IST",
    "social": {
      "instagram": "",
      "youtube": "",
      "facebook": ""
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Service pricing visibility + duration in minutes
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS show_price BOOLEAN NOT NULL DEFAULT false;

-- Backfill duration_minutes from existing duration text where possible
UPDATE services
SET duration_minutes = NULLIF(regexp_replace(duration, '[^0-9]', '', 'g'), '')::INTEGER
WHERE duration_minutes IS NULL AND duration IS NOT NULL AND duration ~ '[0-9]';
