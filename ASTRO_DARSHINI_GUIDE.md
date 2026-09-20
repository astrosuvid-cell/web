# Astro Suvid - Website Setup Guide

## Overview
This is a premium vedic astrology and tarot card reading website for Astro Suvid. The site features a cosmic, celestial design with smooth animations and a professional layout.

## Key Features

### Design Elements
- **Cosmic Theme**: Deep navy background with gold, rose pink, and blue accents
- **Animated Background**: Floating planets and twinkling stars
- **Smooth Animations**: Card hover effects, scroll-triggered reveals, and fade-ins
- **Responsive Design**: Mobile-first approach with full responsive support
- **Glass Morphism**: Modern frosted glass effect on components

### Pages & Functionality

1. **Home Page** (`/`)
   - Hero section with CTA buttons
   - Services preview
   - Astrologer profile section
   - Client testimonials
   - Animated CTA banner
   - Contact footer

2. **Services Page** (`/services`)
   - Detailed service cards with features
   - Service durations
   - Professional layout

3. **Contact Page** (`/contact`)
   - Query form with validation
   - Contact information
   - Direct call/WhatsApp links
   - FAQ section

4. **Header & Footer**
   - Sticky responsive header with scroll effects
   - Mobile hamburger menu
   - Quick contact buttons
   - Footer with contact links

## Important Customization Points

### Contact Information
Update these in all files:
- **Phone Number**: Replace `+919999999999` with your actual phone number
  - Found in: `components/Header.tsx`, `components/Hero.tsx`, `components/Footer.tsx`, `app/contact/page.tsx`
  
- **WhatsApp Number**: Replace `+919999999999` with your WhatsApp number
  - Found in: `components/Header.tsx`, `components/Hero.tsx`, `components/Footer.tsx`, `app/contact/page.tsx`
  
- **Email**: Replace `hello@astrosuvid.com` with your email
  - Found in: `components/Footer.tsx`, `app/contact/page.tsx`

### Branding & Content
- **Logo/Name**: "Astro Suvid" - easily customizable in Header component
- **Tagline**: Edit in `components/Hero.tsx`
- **About Text**: Update in `components/AstrologerProfile.tsx`
- **Services**: Modify in `components/Services.tsx` and `app/services/page.tsx`
- **Testimonials**: Update in `components/Testimonials.tsx`

### Professional Photo
- The astrologer profile section has a placeholder for a professional photo
- Replace the placeholder in `components/AstrologerProfile.tsx` with actual image

## Color Theme

The website uses a custom cosmic color palette:

```
Primary (Gold): #d4af37
Secondary (Rose Pink): #e8b4c8
Accent (Blue): #4a90e2
Background: #0a0e27
Card Background: #1a1f3a
Text (Light): #f5f5f5
Muted: #2d3558
```

All colors are defined in `app/globals.css` as CSS variables and can be easily modified.

## Form Submission

The contact form currently simulates submission (logs to console). To enable real submissions:

1. **Option 1: Email Service** (Recommended)
   - Integrate with Resend, SendGrid, or similar
   - Update `components/ContactForm.tsx` to call your API

2. **Option 2: Backend API**
   - Create an API route: `app/api/contact/route.ts`
   - Save submissions to database
   - Send email notification

Example API route:
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Save to database or send email
  console.log('Contact submission:', data);
  
  return NextResponse.json({ success: true });
}
```

## Animations

Custom animations are defined in `app/globals.css`:
- `slideIn`: Fade in with upward movement
- `fadeIn`: Simple opacity fade
- `glow`: Pulsing glow effect

All card animations use these keyframes with staggered delays for a professional effect.

## Mobile Responsiveness

The design is fully responsive with:
- Mobile hamburger menu
- Touch-friendly buttons and spacing
- Optimized typography for all screen sizes
- Flexible grid layouts

## SEO Optimization

The site includes:
- Proper meta tags and descriptions
- Semantic HTML structure
- Mobile viewport configuration
- Page titles and descriptions for each route

## Deployment

### To Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### To Other Platforms
The site is a Next.js 15 app and works with:
- Vercel (native support)
- Netlify
- Railway
- Any Node.js hosting

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## File Structure

```
app/
├── page.tsx (Home)
├── layout.tsx (Root layout)
├── globals.css (Global styles)
├── services/
│   └── page.tsx
└── contact/
    └── page.tsx

components/
├── Header.tsx
├── Hero.tsx
├── Services.tsx
├── AstrologerProfile.tsx
├── Testimonials.tsx
├── ContactForm.tsx
├── CTABanner.tsx
├── CosmicBackground.tsx
└── Footer.tsx
```

## Support & Customization

The website is built with modern technologies:
- **Next.js 15**: React framework
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Accessible component library
- **Lucide Icons**: Professional icon set

All components are modular and easily customizable. Feel free to adjust colors, text, layout, and functionality to match your brand perfectly.

## Next Steps

1. Update all contact information
2. Add professional photos
3. Update service descriptions
4. Add real testimonials
5. Set up form submission backend
6. Deploy to production
7. Set up analytics (Google Analytics)
8. Consider adding booking system

---

Built with modern web technologies for a premium astrology experience.
