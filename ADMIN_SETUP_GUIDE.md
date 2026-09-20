# Astro Suvid - Admin Panel Setup Guide

## 📋 Overview

This guide will help you set up the complete admin panel system for Astro Suvid with database integration, authentication, and contact management.

## 🗄️ Database Setup

### Step 1: Create Tables in Supabase

Copy and paste the following SQL into your Supabase SQL editor:

```sql
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  features JSONB DEFAULT '[]'::jsonb,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name VARCHAR(255) NOT NULL,
  author_title VARCHAR(255),
  content TEXT NOT NULL,
  service_type VARCHAR(100),
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  description TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  page VARCHAR(255),
  user_ip VARCHAR(50),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_responses_status ON contact_responses(status);
CREATE INDEX IF NOT EXISTS idx_contact_responses_created_at ON contact_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
```

### Step 2: Create Admin User

Execute this SQL to create your admin account (change email and password hash):

```sql
-- First, you need to hash a password. For testing, you can use any SHA-256 hash
-- Use an online SHA-256 generator or the command:
-- echo -n "YourPassword123" | sha256sum

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@astrosuvid.com',
  'your_sha256_hash_here', -- Replace with actual SHA-256 hash of your password
  'Astro Suvid Admin',
  'admin',
  true
);
```

**To generate a SHA-256 hash of your password:**

**On Linux/Mac:**
```bash
echo -n "YourPassword123" | sha256sum
```

**Or use an online tool:** https://www.sha256online.com/

## 🔐 Environment Variables

Make sure these environment variables are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Admin Panel Access

### Login
- Navigate to: `http://localhost:3000/admin/login`
- Email: `admin@astrosuvid.com`
- Password: Your chosen password

### Admin Dashboard Features

1. **Dashboard** - Overview stats and metrics
2. **Contact Responses** - View, manage, and respond to form submissions
3. **Services** - Create and manage your astrology services
4. **Testimonials** - Approve and manage customer testimonials
5. **Email Templates** - Create auto-reply templates (coming soon)
6. **Blog/Resources** - Publish vedic wisdom articles (coming soon)
7. **Analytics** - Track website metrics (coming soon)

## 📝 Features Implemented

### Contact Management
- ✅ View all contact form submissions
- ✅ Search and filter contacts
- ✅ Mark contacts as read/responded
- ✅ Delete contacts
- ✅ Export to CSV
- ✅ Contact form submits data to database

### Services Management
- ✅ View active services
- ✅ Toggle service status
- ✅ Edit and delete services
- ✅ Display services with pricing

### Testimonials Management
- ✅ View all testimonials
- ✅ Approve pending testimonials
- ✅ Mark as featured
- ✅ Delete inappropriate testimonials
- ✅ View ratings and featured status

### Authentication
- ✅ Secure login system
- ✅ Email/password authentication
- ✅ Session management
- ✅ Protected admin routes

## 🎨 Design Features

### Website (Front-end)
- Vedic & Tarot aesthetic with:
  - Deep purple backgrounds (#0f0d1a)
  - Copper/bronze accents (#c97b3d)
  - Mystical purple (#9d4edd)
  - Animated mandala component
  - Tarot card flip animations
  - Zodiac wheel visualization
  - Sanskrit typography

### Admin Panel
- Dark theme matching website
- Responsive sidebar navigation
- Real-time stats dashboard
- Professional card layouts
- Intuitive data management

## 🔄 API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **Required fields:** name, email, phone, service_type, message

### Authentication
- **POST** `/api/admin/login` - Admin login
- **GET** `/api/admin/verify` - Verify token

## 📊 Database Schema

All tables are optimized with:
- UUID primary keys
- Proper timestamps
- Relevant indexes for queries
- JSONB fields for flexible data
- Cascading deletes

## 🛠️ Customization

### Update Contact Information
Edit `components/Header.tsx`, `components/Hero.tsx`, and `components/Footer.tsx`:
- Phone: +919999999999
- WhatsApp: wa.me/919999999999
- Email: admin@astrosuvid.com

### Add Services
Use the Admin Dashboard → Services section or manually insert:

```sql
INSERT INTO services (title, slug, description, price, duration, is_active)
VALUES (
  'Vedic Astrology Reading',
  'vedic-astrology',
  'Comprehensive birth chart analysis',
  5000,
  '60 minutes',
  true
);
```

### Add Testimonials
Testimonials can be added through the admin panel or database.

## ⚠️ Important Security Notes

1. **Never share your admin password**
2. **Use strong passwords** (minimum 12 characters with mixed case, numbers, symbols)
3. **Change default email/password immediately** after setup
4. **Enable RLS** on Supabase tables for production (Row Level Security)
5. **Use HTTPS** when deploying
6. **Store sensitive data** in environment variables only

## 🚀 Deployment

### To Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### To other platforms
Ensure Node.js 18+ is installed and environment variables are configured.

## 📞 Support

For issues or customizations:
- Check Supabase documentation: https://supabase.com/docs
- Review Next.js docs: https://nextjs.org/docs
- Check component usage in components folder

---

**Last Updated:** 2024
**Version:** 1.0
