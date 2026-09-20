-- Setup default admin user for Astro Suvid
-- Email: admin@astrosuvid.com
-- Password: admin123 (hashed with SHA256)

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@astrosuvid.com',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',  -- SHA256 of 'admin123'
  'Admin User',
  'superadmin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Create initial session table index if missing
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

