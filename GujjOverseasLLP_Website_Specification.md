# GujjOverseasLLP — Website Project Specification

**Version:** 1.0  
**Company:** GujjOverseas LLP  
**Domain:** gujjoverseasllp.com  
**Industry:** Agro Products Export  

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [User Roles & Access Tiers](#user-roles--access-tiers)
4. [Public Website — Pages & Features](#public-website--pages--features)
5. [Admin Portal — Features](#admin-portal--features)
6. [SuperAdmin Portal — Features](#superadmin-portal--features)
7. [Database Schema](#database-schema)
8. [Security Requirements](#security-requirements)
9. [Hosting & Infrastructure](#hosting--infrastructure)
10. [Development Phases](#development-phases)
11. [Pending Assets from Founder](#pending-assets-from-founder)

---

## 1. Project Overview

Build a professional, SEO-optimized public-facing website for **GujjOverseas LLP**, an agro products export company. The website must include a secure hidden admin portal for product management and a SuperAdmin portal for full system control. The platform should be production-ready, secure, and deployable on Vercel.

**Primary Goals:**
- Showcase agro products to international buyers
- Build trust with certification badges and professional design
- Allow customers to reach out via WhatsApp, email, and phone
- Give the founder full control over product listings via a secure dashboard
- Maintain a full audit trail of all admin actions

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14 (React) | SEO-friendly, fast, great for product pages |
| Styling | Tailwind CSS | Rapid UI, responsive, clean |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) | Free tier, real-time, built-in auth, file storage |
| Authentication | Supabase Auth + JWT + RBAC | Role-based access (Admin / SuperAdmin) |
| Hosting | Vercel | Free tier, global CDN, auto HTTPS |
| Audit Logs | Supabase DB (append-only table) | Every action logged with timestamp + IP |
| Error Tracking | Sentry | Real-time crash reports for SuperAdmin |
| Rate Limiting | Upstash Redis or Vercel Middleware | Brute-force protection on admin portals |

---

## 3. User Roles & Access Tiers

### 3.1 Public Customer (No Login)
- Browse all products with images, descriptions, origin, specifications
- View About Us page and company certifications
- View Contact page with one-click WhatsApp, Gmail, and phone buttons
- No account or login required

### 3.2 Admin (Founder / Manager)
- Separate hidden login portal — NOT linked from public site
- Add, edit, and delete products
- Upload and manage product images
- View basic website stats (page visits, popular products)
- **Cannot** access site settings, manage user roles, or view audit logs

### 3.3 SuperAdmin
- All Admin capabilities, plus:
- Add and remove Admin accounts
- View full audit ledger (every action, timestamp, IP address)
- View real-time crash reports via Sentry
- Change site-wide settings (contact numbers, company info, banners)
- View all login attempts including failed ones
- Requires 2FA (TOTP) to log in

---

## 4. Public Website — Pages & Features

### 4.1 Homepage (`/`)
- Hero section with company tagline and CTA button
- Featured products grid (latest or manually pinned products)
- Trust signals section: FSSAI, APEDA, ISO certification badges
- About Us snippet with link to full About page
- Contact strip: WhatsApp button, Email button, Phone number

### 4.2 Products Page (`/products`)
- Grid layout of all visible products
- Filter by category (e.g., Grains, Spices, Pulses, Dry Fruits, etc.)
- Search bar to find products by name
- Each product card shows: image, name, category, short description

### 4.3 Product Detail Page (`/products/[slug]`)
- Full product image gallery
- Product name, category, origin
- Full description
- Specifications table (weight, packaging, MOQ, etc.)
- WhatsApp inquiry button pre-filled with product name
- Related products section

### 4.4 About Us Page (`/about`)
- Company story and founding values
- Export experience and global reach
- Certifications display (FSSAI, APEDA, ISO logos)
- Team or founder section (optional, placeholder until content provided)

### 4.5 Contact Page (`/contact`)
- One-click WhatsApp button (opens WhatsApp chat)
- One-click Email button (opens Gmail compose)
- Phone number with click-to-call
- Company address
- Optional: simple inquiry form (name + message + email)

### 4.6 General Public Site Requirements
- Fully responsive: desktop, tablet, mobile
- SEO optimized: meta titles, descriptions, Open Graph tags for every page
- Fast load times: image optimization via Next.js Image component
- Green brand color theme suited for agro/export industry
- Placeholder logo until founder provides final logo file (PNG, transparent background)
- Placeholder contact details until founder provides WhatsApp number, email, phone

---

## 5. Admin Portal — Features

**URL:** `/secure/admin/login` — Hidden, not linked from public site

### 5.1 Login Page (`/secure/admin/login`)
- Email + password login
- Rate limited: max 5 attempts per IP per 15 minutes
- No "Forgot password" link exposed on login page (handled separately)

### 5.2 Dashboard (`/secure/admin/dashboard`)
- Total products count
- Total page visits (last 7 days, last 30 days)
- Most viewed products
- Recent activity summary

### 5.3 Products Management (`/secure/admin/products`)
- Table listing all products with: name, category, status (visible/hidden), created date
- Add New Product button
- Edit and Delete actions per product
- Toggle product visibility (show/hide on public site)

### 5.4 Add Product (`/secure/admin/products/new`)
- Fields: Name, Slug (auto-generated), Category, Short Description, Full Description, Origin, Specifications (key-value pairs), Visibility toggle
- Image upload: drag-and-drop, supports multiple images, stored in Supabase Storage
- Save as Draft or Publish immediately

### 5.5 Edit Product (`/secure/admin/products/[id]/edit`)
- Same fields as Add Product, pre-filled with existing data
- Replace or delete existing images
- Save changes (logged to audit trail)

---

## 6. SuperAdmin Portal — Features

**URL:** `/secure/superadmin/login` — Hidden, not linked from public site  
**Requires:** Email + Password + TOTP (Google Authenticator)

Includes everything in Admin Portal, plus:

### 6.1 Audit Logs (`/secure/superadmin/audit-logs`)
- Append-only table — no one can delete log entries
- Columns: Timestamp, User, Action, Target (product/setting changed), IP Address, User Agent
- Filter by date range, user, or action type
- Export to CSV

### 6.2 User Management (`/secure/superadmin/users`)
- List all Admin accounts
- Add new Admin (name, email, temporary password)
- Deactivate / reactivate Admin accounts
- View last login time per Admin

### 6.3 Site Settings (`/secure/superadmin/settings`)
- Update contact WhatsApp number
- Update contact email
- Update contact phone number
- Update company address
- Update banner message (shown on homepage if needed)
- All changes saved to `site_settings` table and logged to audit trail

### 6.4 Crash Reports (`/secure/superadmin/crash-reports`)
- Embedded Sentry dashboard or direct link to Sentry project
- View real-time frontend and backend errors

### 6.5 Login Attempts (`/secure/superadmin/login-attempts`)
- Table of all login attempts: email used, IP, timestamp, success/failure
- Filter by IP or email to spot brute-force attempts

---

## 7. Database Schema

```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  short_description TEXT,
  description TEXT,
  origin TEXT,
  specs JSONB,               -- key-value pairs for specifications
  images TEXT[],             -- array of Supabase Storage URLs
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users (Admin / SuperAdmin)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'superadmin')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs (append-only — no DELETE or UPDATE allowed)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,       -- e.g., "product.create", "product.delete", "setting.update"
  target TEXT,                -- e.g., product slug or setting key
  payload JSONB,              -- before/after snapshot if applicable
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Login Attempts
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  ip_address TEXT,
  success BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

---

## 8. Security Requirements

| Security Feature | Implementation |
|---|---|
| Hidden portal URLs | `/secure/admin/login` and `/secure/superadmin/login` — not linked from public site |
| Rate limiting | Max 5 login attempts per IP per 15 minutes; IP temporarily blocked after |
| JWT expiry | Access tokens expire in 1 hour; refresh tokens rotate on use |
| 2FA for SuperAdmin | TOTP via Google Authenticator (or Authy) |
| HTTPS | Enforced automatically by Vercel |
| Row-Level Security (RLS) | Supabase RLS ensures Admins can only access their permitted data |
| Audit ledger protection | `audit_logs` table has no DELETE or UPDATE privileges for any role |
| CSRF protection | Built into Next.js API routes |
| Input sanitization | All product inputs sanitized server-side before DB write |
| Content Security Policy | CSP headers configured in `next.config.js` to prevent XSS |
| Secure image uploads | File type and size validation before Supabase Storage write |
| Environment variables | All secrets (Supabase URL, keys, Sentry DSN) in `.env.local` — never committed to Git |

---

## 9. Hosting & Infrastructure

### 9.1 Domain
- **Target domain:** `gujjoverseasllp.com`
- **Recommended registrar:** Hostinger India (lowest INR price) or GoDaddy India
- **Also register:** `gujjoverseasllp.in` as backup (optional but recommended)
- **Renewal:** Yearly — must not expire

### 9.2 Hosting (Vercel — Free Tier)
- Deploy from GitHub repository (auto-deploy on every push to `main`)
- Global CDN — fast load times worldwide
- Automatic HTTPS / SSL certificate on custom domain
- 100GB bandwidth/month on free tier

### 9.3 Database & Storage (Supabase — Free Tier)
- PostgreSQL database hosted on Supabase
- Supabase Storage for product images
- Supabase Auth for Admin and SuperAdmin login
- Free tier limits: 500MB database, 1GB storage — sufficient for launch

### 9.4 DNS Configuration
After buying domain on GoDaddy/Hostinger, point it to Vercel by:
1. Adding Vercel's provided `A Record` or `CNAME` to domain DNS settings
2. Vercel auto-provisions SSL certificate within minutes
3. DNS propagation: up to 24 hours globally

### 9.5 Cost Summary

| Item | Cost | Frequency |
|---|---|---|
| Domain `gujjoverseasllp.com` | ~₹900/year | Yearly |
| Domain `gujjoverseasllp.in` (optional) | ~₹500/year | Yearly |
| Vercel Hosting | ₹0 | Free tier |
| Supabase DB + Storage | ₹0 | Free tier |
| SSL Certificate | ₹0 | Auto via Vercel |
| Error Tracking (Sentry) | ₹0 | Free tier |
| **Total to start** | **~₹900–1,400/year** | |

---

## 10. Development Phases

### Phase 1 — Public Website
- Homepage, Products page, Product detail page, About Us, Contact page
- Fully responsive (mobile + desktop)
- SEO meta tags on all pages
- Green agro brand theme
- Placeholder logo and contact info

### Phase 2 — Supabase Backend Setup
- PostgreSQL schema (all tables above)
- Supabase Auth configuration for Admin and SuperAdmin roles
- Row-Level Security (RLS) policies
- Supabase Storage bucket for product images

### Phase 3 — Admin Dashboard
- Hidden login portal at `/secure/admin/login`
- Product CRUD (Create, Read, Update, Delete)
- Image upload and management
- Basic analytics dashboard

### Phase 4 — SuperAdmin Panel
- Hidden login at `/secure/superadmin/login` with 2FA
- Audit log viewer
- User management (add/deactivate Admins)
- Site settings control
- Login attempts log

### Phase 5 — Security Hardening
- Rate limiting on login endpoints (Upstash Redis or Vercel Middleware)
- TOTP 2FA setup for SuperAdmin
- CSP headers in `next.config.js`
- Input sanitization and file type validation
- Penetration test checklist review

### Phase 6 — Integrations
- Sentry error tracking setup
- Google Analytics or Vercel Analytics for page view stats
- WhatsApp Business deep link integration

### Phase 7 — Testing & Deployment
- Cross-browser and mobile testing
- SEO audit
- Performance audit (Lighthouse score target: 90+)
- Deploy to Vercel, connect custom domain
- Final review with founder

---

## 11. Pending Assets from Founder

The following items are needed from the founder before the website can go fully live. Development will proceed with placeholders until these are received.

| Item | Status | Notes |
|---|---|---|
| Company logo | Pending | PNG format, transparent background preferred |
| WhatsApp business number | Pending | Used for customer inquiry buttons |
| Contact email address | Pending | Used for email inquiry button |
| Contact phone number | Pending | Used for click-to-call |
| Company address | Pending | Shown on Contact page |
| Product list with details | Pending | Names, descriptions, images, origins, specs |
| Certification images | Pending | FSSAI, APEDA, ISO logos or certificate scans |
| About Us content | Pending | Company story, founding year, team info |

---

*Document prepared for development handoff. All technical decisions above are recommendations based on the project requirements. Final tech choices should be confirmed before development begins.*
