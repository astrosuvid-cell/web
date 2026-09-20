-- FIXED: Supabase Compatible Schema (No IMMUTABLE issues)
-- Copy this to Supabase Dashboard → SQL Editor → Run ALL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Astro Mall Products (MAIN TABLE)
CREATE TABLE IF NOT EXISTS astro_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  price_type VARCHAR(20) DEFAULT 'total' CHECK (price_type IN ('total', 'per_unit')),
  unit_name VARCHAR(20) DEFAULT 'total' CHECK (unit_name IN ('total', 'ratti')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact Form Responses
CREATE TABLE IF NOT EXISTS contact_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  service_type VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  read_at TIMESTAMP,
  responded_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  icon VARCHAR(50),
  price DECIMAL(10, 2),
  duration VARCHAR(100),
  features JSONB DEFAULT '[]',
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  category VARCHAR(100),
  image_url VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Astro Suvid',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  page VARCHAR(255),
  user_ip VARCHAR(50),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Safe Indexes (Supabase compatible)
CREATE INDEX IF NOT EXISTS idx_contact_responses_status ON contact_responses(status);
CREATE INDEX IF NOT EXISTS idx_contact_responses_created ON contact_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_astro_products_active ON astro_products(is_active);
CREATE INDEX IF NOT EXISTS idx_astro_products_order ON astro_products(order_index);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);

-- Insert Default Admin
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES ('admin@astrosuvid.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Astro Suvid Admin', 'superadmin', true)
ON CONFLICT (email) DO NOTHING;

-- Sample Product (optional)
INSERT INTO astro_products (name, image_url, price, price_type, unit_name, description, is_active)
VALUES ('Blue Sapphire', 'https://images.unsplash.com/photo-15883027...
