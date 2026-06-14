# GujjOverseas LLP — Full Implementation Plan v2.0
### Prepared for: Antigravity Development Team
**Client:** GujjOverseas LLP
**Live URL:** https://gujjoverseasllp-ten.vercel.app
**Target Domain:** gujjoverseasllp.com
**Document Version:** 2.0
**Date:** June 2026

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [What Changed in v2](#2-what-changed-in-v2)
3. [Tech Stack](#3-tech-stack)
4. [Site Architecture & Routes](#4-site-architecture--routes)
5. [Database Schema](#5-database-schema)
6. [Hero & Landing Page — Full Spec](#6-hero--landing-page--full-spec)
7. [Public Website — All Pages](#7-public-website--all-pages)
8. [Admin Portal — Full Feature Set](#8-admin-portal--full-feature-set)
9. [SuperAdmin Portal — Full Feature Set](#9-superadmin-portal--full-feature-set)
10. [WhatsApp Chatbot — Full Implementation](#10-whatsapp-chatbot--full-implementation)
11. [Security Implementation](#11-security-implementation)
12. [Environment Variables](#12-environment-variables)
13. [Hosting & Deployment](#13-hosting--deployment)
14. [Development Phases & Timeline](#14-development-phases--timeline)
15. [Cost Breakdown](#15-cost-breakdown)
16. [Pending Assets from Client](#16-pending-assets-from-client)

---

## 1. Project Summary

GujjOverseas LLP is a Gujarat-based general export company. The website serves as their global digital storefront for multiple product categories including Agro Products, Textiles, Handicrafts, Imitation Jewellery, and Spices.

The platform has four components:

- **Public website** — product discovery and inquiry for international buyers
- **Admin portal** — secure dashboard for the founder to manage products and inquiries
- **SuperAdmin portal** — full system control, audit logs, user management, SEO, and appearance
- **WhatsApp chatbot** — automated product info and inquiry capture via WhatsApp

> **Important:** The existing live site at `gujjoverseasllp-ten.vercel.app` is the v1 base. All work in this document describes additions and replacements to that base. Do not rebuild from scratch — extend and refactor.

---

## 2. What Changed in v2

| Area | v1 | v2 |
|---|---|---|
| Genre | Agro products only | Multi-category: Agro, Textiles, Handicrafts, Jewellery, Spices, more |
| Hero section | Basic hero with tagline | Full split-layout hero with category grid, stats bar, feature strip |
| Navbar | Logo + links | Logo + links + phone + WhatsApp CTA button |
| Categories | Single agro category | 6 categories with icons, colors, sub-labels |
| Admin features | Basic product CRUD | + Inquiry pipeline, CSV import/export, analytics per category, templates |
| SuperAdmin features | Audit logs, user management | + Appearance control, category management, banner tool, SEO control, backup |
| Chatbot menu | Single product search flow | Multi-category menu, price quote flow, new arrival flags |
| Certifications | FSSAI, APEDA, ISO | + GST Verified, MSME Registered, Export House |
| Stats bar | Not present | 5-stat bar: Products, Countries, Categories, Certified, Response time |

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | All pages — public + admin + superadmin |
| Styling | Tailwind CSS | Utility-first, responsive |
| Database | Supabase (PostgreSQL) | All data storage |
| Auth | Supabase Auth + JWT + RBAC | Roles: `admin`, `superadmin` |
| File Storage | Supabase Storage | Product images, logos, certification badges |
| 2FA | TOTP via `otplib` | SuperAdmin only — Google Authenticator |
| Rate Limiting | Upstash Redis + Vercel Middleware | Login brute-force protection |
| Rich Text Editor | Tiptap | Product descriptions in Admin |
| Error Tracking | Sentry | Frontend + backend errors |
| Analytics | Vercel Analytics | Page views, traffic sources |
| WhatsApp | WATI on Meta WhatsApp Business API | Chatbot + human inbox |
| Hosting | Vercel | Auto-deploy from GitHub `main` |
| Domain | gujjoverseasllp.com | Hostinger or GoDaddy |

---

## 4. Site Architecture & Routes

### Public Routes

```
/                          → Homepage (new hero + categories + features)
/products                  → All products (multi-category grid + filters)
/products/[slug]           → Product detail page
/categories                → All categories overview page
/categories/[slug]         → Category-specific product listing
/about                     → About Us
/contact                   → Contact page with inquiry form
/privacy-policy            → Privacy policy (already exists)
/terms                     → Terms of service (already exists)
```

### Admin Routes (hidden, not linked publicly)

```
/secure/admin/login        → Admin login
/secure/admin/dashboard    → Stats overview
/secure/admin/products     → Products table
/secure/admin/products/new → Add product
/secure/admin/products/[id]/edit → Edit product
/secure/admin/categories   → Manage categories
/secure/admin/inquiries    → Inquiry list view
/secure/admin/inquiries/pipeline → Kanban board view
/secure/admin/templates    → WhatsApp reply templates
/secure/admin/chatbot      → Chatbot logs + config
/secure/admin/analytics    → Category + product analytics
/secure/admin/media        → Image library
```

### SuperAdmin Routes (hidden, not linked publicly)

```
/secure/superadmin/login           → SuperAdmin login (password + TOTP)
/secure/superadmin/dashboard       → Full overview
/secure/superadmin/products        → All product management (same as admin)
/secure/superadmin/categories      → Full category management
/secure/superadmin/inquiries       → All inquiries
/secure/superadmin/users           → Manage admin accounts
/secure/superadmin/audit-logs      → Full audit trail
/secure/superadmin/login-attempts  → Login attempt log + IP blocking
/secure/superadmin/sessions        → Active session management
/secure/superadmin/analytics       → Full site analytics + reports
/secure/superadmin/chatbot         → Full chatbot control
/secure/superadmin/appearance      → Hero, stats, certifications, logo
/secure/superadmin/banner          → Site-wide announcement banner
/secure/superadmin/seo             → Meta tags, OG image, sitemap
/secure/superadmin/settings        → Contact info, working hours, maintenance mode
/secure/superadmin/backup          → DB + media backup and restore
/secure/superadmin/crash-reports   → Sentry error feed
```

---

## 5. Database Schema

Run all SQL below in the Supabase SQL editor. Apply RLS policies as specified in Section 11.

```sql
-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT UNIQUE NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  icon         TEXT,                    -- Tabler icon name e.g. "plant-2"
  color        TEXT,                    -- hex color for UI e.g. "#2ecc71"
  is_visible   BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,          -- drag-to-reorder
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Seed default categories
INSERT INTO categories (name, slug, icon, color, display_order) VALUES
  ('Agro Products',       'agro-products',       'plant-2',  '#2ecc71', 1),
  ('Textiles',            'textiles',             'scissors', '#9b59b6', 2),
  ('Handicrafts',         'handicrafts',          'palette',  '#e67e22', 3),
  ('Imitation Jewellery', 'imitation-jewellery',  'diamond',  '#f1c40f', 4),
  ('Spices & Herbs',      'spices-herbs',         'flame',    '#e74c3c', 5),
  ('Home Furnishings',    'home-furnishings',     'sofa',     '#3498db', 6);


-- ─────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description       TEXT,              -- rich text HTML from Tiptap
  origin            TEXT,
  specs             JSONB,             -- {"MOQ": "1 Ton", "Packaging": "25kg bags"}
  images            TEXT[],            -- Supabase Storage URLs
  primary_image     TEXT,
  tags              TEXT[],
  is_visible        BOOLEAN DEFAULT true,
  is_featured       BOOLEAN DEFAULT false,
  is_new_arrival    BOOLEAN DEFAULT false,
  meta_title        TEXT,
  meta_description  TEXT,
  scheduled_at      TIMESTAMPTZ,
  view_count        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at on every edit
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────
-- USERS (Admins + SuperAdmins)
-- ─────────────────────────────────────────
CREATE TABLE users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  role         TEXT CHECK (role IN ('admin', 'superadmin')) NOT NULL,
  permissions  JSONB DEFAULT '{}',    -- per-user granular overrides
  is_active    BOOLEAN DEFAULT true,
  totp_secret  TEXT,                  -- encrypted TOTP secret (superadmin only)
  created_at   TIMESTAMPTZ DEFAULT now(),
  last_login   TIMESTAMPTZ
);


-- ─────────────────────────────────────────
-- SITE SETTINGS
-- ─────────────────────────────────────────
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_by  UUID REFERENCES users(id),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number',        ''),
  ('contact_email',          ''),
  ('contact_phone',          ''),
  ('company_address',        ''),
  ('company_tagline',        'Export Quality Products From India To The World'),
  ('hero_badge_text',        'Trusted Indian Exporter Since 2024'),
  ('hero_subtext',           ''),
  ('stat_products',          '50+'),
  ('stat_countries',         '20+'),
  ('stat_categories',        '5+'),
  ('stat_response_time',     '24h'),
  ('homepage_banner',        ''),
  ('banner_enabled',         'false'),
  ('banner_color',           'info'),
  ('banner_start',           ''),
  ('banner_end',             ''),
  ('maintenance_mode',       'false'),
  ('chatbot_enabled',        'true'),
  ('chatbot_working_hours',  '09:00-18:00'),
  ('chatbot_working_days',   'Mon-Sat'),
  ('meta_title',             'GujjOverseas LLP | Premium Multi-Category Export'),
  ('meta_description',       'GujjOverseas LLP exports premium Agro, Textile, Handicraft and Jewellery products from Gujarat, India to buyers worldwide.'),
  ('og_image_url',           '');


-- ─────────────────────────────────────────
-- CUSTOMER INQUIRIES
-- ─────────────────────────────────────────
CREATE TABLE inquiries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name       TEXT,
  company_name        TEXT,
  whatsapp_number     TEXT,
  email               TEXT,
  product_name        TEXT,
  category            TEXT,
  quantity            TEXT,
  destination_country TEXT,
  message             TEXT,
  source              TEXT CHECK (source IN ('chatbot', 'contact_form', 'direct')),
  pipeline_stage      TEXT CHECK (pipeline_stage IN ('new', 'contacted', 'negotiating', 'closed')) DEFAULT 'new',
  status              TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
  created_at          TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────
-- WHATSAPP REPLY TEMPLATES
-- ─────────────────────────────────────────
CREATE TABLE reply_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,           -- e.g. "Initial product inquiry reply"
  body       TEXT NOT NULL,           -- e.g. "Hi {name}, thank you for your interest in {product}..."
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────
-- AUDIT LOGS (append-only forever)
-- ─────────────────────────────────────────
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  action     TEXT NOT NULL,
  target     TEXT,
  payload    JSONB,                   -- {before: {...}, after: {...}}
  ip_address TEXT,
  user_agent TEXT,
  timestamp  TIMESTAMPTZ DEFAULT now()
);

REVOKE UPDATE, DELETE ON audit_logs FROM authenticated;
REVOKE UPDATE, DELETE ON audit_logs FROM service_role;


-- ─────────────────────────────────────────
-- LOGIN ATTEMPTS
-- ─────────────────────────────────────────
CREATE TABLE login_attempts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT,
  ip_address TEXT,
  success    BOOLEAN,
  timestamp  TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────
-- BLOCKED IPs
-- ─────────────────────────────────────────
CREATE TABLE blocked_ips (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT UNIQUE NOT NULL,
  reason     TEXT,
  blocked_by UUID REFERENCES users(id),
  blocked_at TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────
-- CHATBOT CONVERSATION LOGS
-- ─────────────────────────────────────────
CREATE TABLE chatbot_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  direction       TEXT CHECK (direction IN ('inbound', 'outbound')),
  message         TEXT,
  message_type    TEXT,              -- text | image | button_reply | list_reply
  session_id      TEXT,
  timestamp       TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────
-- CHATBOT SESSIONS (state tracking)
-- ─────────────────────────────────────────
CREATE TABLE chatbot_sessions (
  whatsapp_number TEXT PRIMARY KEY,
  current_flow    TEXT,              -- greeting | browse | search | inquiry | human
  current_step    INT DEFAULT 0,
  collected_data  JSONB DEFAULT '{}',
  last_active     TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Hero & Landing Page — Full Spec

This is a complete replacement of the existing hero section. Build as a standalone `HeroSection` component in `components/public/HeroSection.tsx`.

### 6.1 Navbar

```
Layout: flex row, space-between, sticky on scroll, height 64px
Background: dark green (#0a2e1a) — same as hero bg
Border-bottom: 1px solid rgba(255,255,255,0.1)

Left:   [Logo icon] [Company name] [Global Exports subtext]
Center: Home | Products | Categories | About | Contact
Right:  [+91 phone number] [WhatsApp Us — green pill button]
```

All navbar content (phone, WhatsApp number) loaded from `site_settings` table so SuperAdmin can update them without code changes.

Mobile: collapse center nav into hamburger menu. Phone hidden. WhatsApp button stays visible.

### 6.2 Hero Split Layout

```
Grid: 2 columns (55% left / 45% right)
Background: dark green gradient (#0a2e1a → #0f4a2a → #1a6b3a)
Overlay: subtle dot-grid pattern, opacity 4%
Min-height: 460px
```

**Left column — value proposition:**

```
1. Badge pill (green outline):
   • animated green dot + text from site_settings key: hero_badge_text
   • e.g. "Trusted Indian Exporter Since 2024"

2. H1 heading (38px, white):
   "Export [Quality] Products From India To The World"
   • word "Quality" in accent green (#2ecc71)
   • text editable via SuperAdmin → Appearance settings

3. Subtext (14px, 65% white opacity):
   Loaded from site_settings key: hero_subtext
   Max width: 400px

4. Two CTA buttons:
   Primary (green fill): "Explore All Products" → /products
   Secondary (outline): "Send an Inquiry" → /contact

5. Certification pill badges (row):
   FSSAI Certified | APEDA Registered | ISO 9001 | GST Verified
   Loaded from site_settings — SuperAdmin can add/remove badges
```

**Right column — category grid:**

```
Label: "Browse by category" (11px, 40% white, uppercase)

2×3 grid of category cards:
Each card contains:
  • Colored icon background (color from categories.color)
  • Tabler icon (icon from categories.icon)
  • Category name (13px, white, 500 weight)
  • Sub-labels (11px, 45% white) — first 3 sub-categories

Cards loaded dynamically from categories table where is_visible = true
Ordered by display_order
Clicking a card navigates to /categories/[slug]

Last card if < 6 categories: show dashed "More Coming Soon" placeholder
```

### 6.3 Stats Bar

```
Background: rgba(0,0,0,0.3), sits below hero grid, above white section
Border-top: 1px solid rgba(255,255,255,0.08)
Padding: 18px 40px

5 equally spaced stats — all values loaded from site_settings:
  stat_products   → label "Products Listed"
  stat_countries  → label "Countries Served"
  stat_categories → label "Product Categories"
  "100%"          → label "Quality Certified"   (hardcoded)
  stat_response_time → label "Inquiry Response"

Each stat: large number in accent green (#2ecc71), muted label below
Dividers between stats: 1px solid rgba(255,255,255,0.08)
```

### 6.4 "Why Choose Us" Feature Strip

```
Background: white (var(--color-background-primary))
Padding: 28px 40px

Label: "Why choose GujjOverseas" (11px, muted, uppercase)

4-column grid of feature cards (background: var(--color-background-secondary)):
  1. Certified Quality      — icon: ti-certificate
  2. End-to-End Export      — icon: ti-truck-delivery
  3. WhatsApp Support       — icon: ti-message-chatbot
  4. Direct from Source     — icon: ti-building-store

Each card: icon → title (13px, 500) → description (12px, muted)
```

---

## 7. Public Website — All Pages

### 7.1 Homepage (`/`)

Sections in order:
1. Navbar (sticky)
2. Hero split layout (Section 6.2)
3. Stats bar (Section 6.3)
4. Why Choose Us strip (Section 6.4)
5. Featured Products grid — fetch `is_featured = true AND is_visible = true`, max 6
6. Browse by Category section — all visible categories as large cards with description
7. Trust & Certifications section — logos of FSSAI, APEDA, ISO, GST, MSME
8. Announcement Banner — conditional, shown only if `banner_enabled = true` in site_settings
9. Contact strip — WhatsApp, Email, Phone buttons (all loaded from site_settings)
10. Footer

### 7.2 Products Page (`/products`)

- Sidebar or top filter bar: filter by category (chips from categories table)
- Search bar: live filter by product name and tags
- Sort: Newest First, A–Z, Most Viewed
- Grid: 3 cols desktop / 2 tablet / 1 mobile
- Each card: primary image, "New" badge if `is_new_arrival = true`, name, category badge, short description, "View Details" button
- Pagination or infinite scroll (20 products per page)
- Empty state: "No products found in this category yet."
- Increment `view_count` on product card click

### 7.3 Categories Page (`/categories`)

- Large card grid — one card per visible category
- Each card: icon, color accent, category name, description, product count badge, "Browse" button → `/categories/[slug]`

### 7.4 Category Detail Page (`/categories/[slug]`)

- Category hero banner: name, icon, description, color themed
- Product grid filtered to that category
- Same filter/search/sort as `/products`

### 7.5 Product Detail Page (`/products/[slug]`)

- Image gallery: primary image large, thumbnails below, click to switch
- Right panel: name, "New" badge if applicable, category badge, origin
- Short description
- Full description (rendered from rich text HTML)
- Specifications table (rendered from `specs` JSONB)
- Tags as pills
- WhatsApp inquiry button: `https://wa.me/{number}?text=Hi, I'm interested in {product_name} from GujjOverseas LLP`
- Related products: 3 products from same category (exclude current)
- SEO: use `meta_title` and `meta_description` from product row

### 7.6 About Page (`/about`)

- Company intro and founding story
- Multi-category export description
- Export destinations map or stats
- Certifications grid with logos
- Founder section (placeholder until content provided)

### 7.7 Contact Page (`/contact`)

- WhatsApp, Email, Phone, Address (all from site_settings)
- Inquiry form fields:
  - Full Name (required)
  - Email
  - WhatsApp Number (required)
  - Category of Interest (dropdown from categories table)
  - Product of Interest (optional text)
  - Destination Country (required)
  - Message
- On submit: sanitize inputs → INSERT into `inquiries` (source: `contact_form`) → show success message
- Validation: required fields, valid email format, min 10-digit phone

---

## 8. Admin Portal — Full Feature Set

**Base path:** `/secure/admin`
**Auth guard:** Middleware checks for valid Supabase session with `role IN ('admin', 'superadmin')`
**Session timeout:** Auto sign-out after 60 minutes of inactivity

---

### 8.1 Login (`/secure/admin/login`)

- Email + password fields
- On submit: `supabase.auth.signInWithPassword()`
- Verify role from `users` table — reject if not admin or superadmin
- Check `is_active = true` — reject if deactivated
- Check IP against `blocked_ips` table — reject if blocked
- On success: INSERT `login_attempts` (success: true) → send login notification email
- On failure: INSERT `login_attempts` (success: false) → increment Upstash rate limit counter
- After 5 failures from same IP in 15 min: return HTTP 429, block IP

---

### 8.2 Dashboard (`/secure/admin/dashboard`)

**Metric cards (row 1):**
- Total products (visible / hidden split)
- Total inquiries (new / unread badge)
- Today's chatbot conversations
- This month's page views

**Charts (row 2):**
- Line chart: page views last 30 days (Vercel Analytics API)
- Bar chart: products per category

**Tables (row 3):**
- Top 5 most viewed products (name, category, view count)
- Recent 5 inquiries (name, product, source, time)

**Quick actions:**
- Add Product
- View New Inquiries
- Open Chatbot Logs
- View Media Library

---

### 8.3 Products List (`/secure/admin/products`)

**Table columns:** Thumbnail | Name | Category | Status | Featured | New Arrival | Views | Date | Actions

**Filters above table:**
- Search by name
- Filter by category (dropdown)
- Filter by status (All / Visible / Hidden / Draft)

**Per-row actions:**
- Edit
- Delete (confirm modal) → DELETE + audit log
- Toggle Visible / Hidden → PATCH + audit log
- Toggle Featured → PATCH + audit log
- Toggle New Arrival → PATCH + audit log
- Duplicate → INSERT copy with "(Copy)" suffix in name + audit log
- Preview → open `/products/[slug]` in new tab
- Copy shareable link to clipboard

**Bulk actions (checkboxes):**
- Bulk set Visible
- Bulk set Hidden
- Bulk Delete
- Bulk set Category

**Top bar buttons:**
- Add New Product
- Import from CSV
- Export to CSV

---

### 8.4 Add Product (`/secure/admin/products/new`)

| Field | Input Type | Notes |
|---|---|---|
| Name | Text | Required |
| Slug | Text | Auto-generated from name, editable, validated `/^[a-z0-9-]+$/` |
| Category | Select | Options from `categories` table |
| Short Description | Textarea | Max 160 chars, character counter shown |
| Full Description | Tiptap rich text editor | Bold, lists, headings supported |
| Origin | Text | e.g. "Ahmedabad, Gujarat, India" |
| Specifications | Dynamic key-value builder | Add / remove rows, e.g. MOQ → 1 Ton |
| Tags | Tag input | Comma-separated, stored as `TEXT[]` |
| Images | Drag-and-drop multi-upload | Validates: jpeg/png/webp only, max 5MB each |
| Primary Image | Radio selector | Select from uploaded images |
| Image Reorder | Drag handles | Reorder display sequence |
| Meta Title | Text | Defaults to product name |
| Meta Description | Textarea | Max 160 chars |
| Visibility | Toggle | Visible / Hidden |
| Featured | Toggle | Show on homepage grid |
| New Arrival | Toggle | Show "New" badge on cards |
| Schedule Publish | Date + time picker | Optional future publish |

**On submit:**
1. Validate all required fields server-side
2. Sanitize all text inputs (`isomorphic-dompurify`)
3. Validate image file types and sizes
4. Upload images to Supabase Storage bucket `product-images`
5. INSERT product row into `products` table
6. INSERT into `audit_logs`: `action = "product.create"`, `target = slug`
7. Redirect to products list with success toast

---

### 8.5 Edit Product (`/secure/admin/products/[id]/edit`)

- All fields pre-filled from existing product row
- Image management: view existing images, delete individual, upload new, reorder
- On save:
  - Capture `before` snapshot of product row
  - PATCH product in `products` table
  - INSERT into `audit_logs`: `action = "product.update"`, `payload = {before, after}`
- Delete button at bottom: confirm modal → DELETE + audit log

---

### 8.6 Categories (`/secure/admin/categories`)

- List all categories with: icon, name, slug, product count, visible status
- Add category: name → auto slug → icon picker (Tabler icon name) → color picker
- Rename category
- Delete category (warning shown if products are assigned)
- All changes → audit log

---

### 8.7 Inquiry Management (`/secure/admin/inquiries`)

**List view — table columns:**
Date | Name | WhatsApp | Category | Product | Country | Source | Stage | Status | Actions

**Filters:**
- By status: New / Read / Replied / Archived
- By source: Chatbot / Contact Form
- By category
- Date range picker

**Per-row actions:**
- Mark Read / Replied / Archived → PATCH `status`
- Move pipeline stage → PATCH `pipeline_stage`
- Reply via WhatsApp → open `wa.me` link with pre-filled template
- Reply via Email → open `mailto:` link
- View full inquiry details (slide-out panel)

---

### 8.8 Inquiry Pipeline (`/secure/admin/inquiries/pipeline`)

Kanban board with 4 columns:

```
[ New ]  →  [ Contacted ]  →  [ Negotiating ]  →  [ Closed ]
```

- Each inquiry is a draggable card
- Card shows: customer name, product, country, source badge, date
- Drag card between columns → PATCH `pipeline_stage` + audit log
- Click card → expand full inquiry details in modal
- Column headers show count of cards in that stage

---

### 8.9 WhatsApp Templates (`/secure/admin/templates`)

- List of saved reply templates
- Each template: name, body text with `{name}`, `{product}`, `{category}` placeholders
- Add / edit / delete templates
- Templates available as a dropdown when replying to inquiries

---

### 8.10 Chatbot Logs (`/secure/admin/chatbot`)

- Paginated list of conversations from `chatbot_logs`, grouped by `session_id`
- Filter by date range or WhatsApp number
- Click a session to expand full conversation thread
- Most asked questions aggregation (top 10)
- Toggle chatbot on/off → PATCH `site_settings` key `chatbot_enabled`

---

### 8.11 Product Analytics (`/secure/admin/analytics`)

- Top 10 most viewed products (bar chart)
- Views per category (pie or bar chart)
- Inquiries per category (bar chart)
- Inquiries per source: chatbot vs form (donut chart)
- Traffic sources overview (from Vercel Analytics API)
- Date range filter: last 7 days / 30 days / 90 days / custom

---

### 8.12 Media Library (`/secure/admin/media`)

- Grid view of all images in Supabase Storage bucket `product-images`
- Shows: thumbnail, file name, size, upload date, which product it's used in
- Delete unused images (with warning if image is assigned to a product)
- Storage usage bar: used MB / 1000 MB

---

## 9. SuperAdmin Portal — Full Feature Set

**Base path:** `/secure/superadmin`
**Auth guard:** Middleware checks session + `role = 'superadmin'`
**2FA required:** TOTP code verified on every login

Includes all Admin portal pages (Sections 8.1–8.12) plus the following:

---

### 9.1 SuperAdmin Login (`/secure/superadmin/login`)

Step 1: Email + password → verify credentials
Step 2: Prompt for 6-digit TOTP code → verify server-side with `otplib`
Step 3: Issue session token only after both steps pass
On success: send alert email to SuperAdmin, INSERT into `login_attempts`

---

### 9.2 Audit Logs (`/secure/superadmin/audit-logs`)

- All rows from `audit_logs`, paginated (50 per page), newest first
- Columns: Timestamp | User | Action | Target | Before/After | IP | Device
- Color coding: green rows for `.create`, amber for `.update`, red for `.delete`
- Filters: date range | user dropdown | action type dropdown | IP search
- Auto-flagged rows: highlight if >10 actions from same user within 1 minute
- Export filtered view → CSV or PDF

---

### 9.3 User Management (`/secure/superadmin/users`)

- Table: Name | Email | Role | Status | Last Login | This Month's Actions | Actions
- Add new Admin: name, email, role, send Supabase Auth invite email
- Edit: name, role
- Deactivate → PATCH `is_active = false` + audit log (user immediately blocked)
- Reactivate → PATCH `is_active = true` + audit log
- Force logout → revoke all active sessions via Supabase Auth Admin API
- View login history for user (filter `login_attempts` by email)
- Permission matrix per Admin: toggle which sections they can access

---

### 9.4 Active Sessions (`/secure/superadmin/sessions`)

- List of all currently active Admin/SuperAdmin sessions
- Columns: User | Role | Login Time | Last Activity | IP | Device
- Force logout any session individually
- "Logout all except mine" button

---

### 9.5 Login Attempts (`/secure/superadmin/login-attempts`)

- All rows from `login_attempts`, paginated
- Columns: Timestamp | Email | IP | Success/Fail
- Color: green rows for success, red for failure
- Filters: by IP, by email, by success/fail, date range
- "Block IP" button per row → INSERT into `blocked_ips` + audit log
- View blocked IPs list with unblock option

---

### 9.6 Appearance Control (`/secure/superadmin/appearance`)

All fields update `site_settings` table:

| Setting | Key | Input |
|---|---|---|
| Hero badge text | `hero_badge_text` | Text |
| Hero subtext | `hero_subtext` | Textarea |
| Company tagline | `company_tagline` | Text |
| Stat: Products | `stat_products` | Text |
| Stat: Countries | `stat_countries` | Text |
| Stat: Categories | `stat_categories` | Text |
| Stat: Response time | `stat_response_time` | Text |
| Certification badges | (Supabase Storage) | Upload PNG files (add/remove) |
| Company logo | (Supabase Storage) | Upload PNG — replaces site logo |
| OG/Share image | `og_image_url` | Upload image |

- Live preview panel showing how changes will look on the hero
- Save → PATCH site_settings + audit log

---

### 9.7 Category Management (`/secure/superadmin/categories`)

Extends admin category management with:

- Drag to reorder category display sequence → PATCH `display_order`
- Toggle category visibility on public site → PATCH `is_visible`
- Set category icon (Tabler icon picker)
- Set category accent color (color picker)
- Set category description (shown on `/categories/[slug]` hero)
- All changes → audit log

---

### 9.8 Announcement Banner (`/secure/superadmin/banner`)

- Banner message text field
- Color selector: Info (blue) / Success (green) / Warning (amber)
- Schedule: start date + end date (banner auto-hides after end date)
- Toggle on/off instantly
- Preview how banner looks on homepage
- Save → PATCH site_settings keys + audit log

---

### 9.9 SEO Control (`/secure/superadmin/seo`)

- Global meta title → `site_settings.meta_title`
- Global meta description → `site_settings.meta_description`
- OG share image → upload to Supabase Storage → `site_settings.og_image_url`
- Per-page SEO overrides for: Homepage, About, Contact, Categories
- Sitemap auto-generation toggle (regenerates `/sitemap.xml` on product add/edit)
- Robots.txt display (read-only — edit via Vercel file)

---

### 9.10 Site Settings (`/secure/superadmin/settings`)

| Setting | Key | Input |
|---|---|---|
| WhatsApp number | `whatsapp_number` | Text (international format) |
| Contact email | `contact_email` | Email |
| Contact phone | `contact_phone` | Text |
| Company address | `company_address` | Textarea |
| Chatbot on/off | `chatbot_enabled` | Toggle |
| Chatbot working hours | `chatbot_working_hours` | Time range picker (e.g. 09:00–18:00) |
| Chatbot working days | `chatbot_working_days` | Multi-select (Mon–Sun) |
| Maintenance mode | `maintenance_mode` | Toggle (public site shows "Coming Soon") |

All saves → audit log entry

---

### 9.11 Full Analytics (`/secure/superadmin/analytics`)

Everything in Admin analytics plus:

- Full Vercel Analytics embed: top pages, traffic sources, device breakdown, country breakdown
- Chatbot performance:
  - Total conversations this month
  - Top chatbot flows used (browse / search / inquiry / human)
  - Inquiry capture rate (how many conversations lead to an inquiry)
  - Busiest hours heatmap (Mon–Sun × 0h–23h)
  - Most asked product names
- Export any chart/table to CSV or PDF
- Weekly auto-report: every Monday at 8am IST, email report to SuperAdmin with key stats

---

### 9.12 Chatbot Full Control (`/secure/superadmin/chatbot`)

Everything in Admin chatbot section plus:

- Set chatbot escalation rules: e.g. "if customer types 'urgent' → hand to human"
- Block a WhatsApp number from chatbot (spam protection)
- View and export full conversation history (all time)
- Test chatbot: send a test message from dashboard to verify flows
- Set offline message (shown when chatbot is outside working hours)

---

### 9.13 Crash Reports (`/secure/superadmin/crash-reports`)

- Sentry issues feed via Sentry API
- Columns: Error message | Frequency | Users affected | First seen | Last seen | Status
- Mark errors as resolved
- Critical errors auto-trigger email alert to SuperAdmin (configure in Sentry project settings)

---

### 9.14 Backup & Restore (`/secure/superadmin/backup`)

- Download full `products` table as JSON or CSV
- Download full `categories` table as JSON
- Download full `inquiries` table as CSV
- Download all product images as ZIP (via Supabase Storage API)
- Scheduled auto-backup: every Sunday at midnight IST → email download links to SuperAdmin
- Restore: upload a previously exported JSON to restore products (with conflict handling — skip duplicates or overwrite)

---

## 10. WhatsApp Chatbot — Full Implementation

### 10.1 Platform

Use **WATI** (wati.io) on the official Meta WhatsApp Business API.

Setup steps:
1. Register on wati.io, connect Meta Business Manager
2. Verify WhatsApp Business number with Meta
3. Configure webhook URL: `https://gujjoverseasllp.com/api/chatbot/webhook`
4. Store WATI API token and webhook secret in Vercel environment variables

---

### 10.2 Webhook Handler — `/api/chatbot/webhook`

```
POST request from WATI on every inbound message

Steps:
1. Verify WATI webhook signature header
2. Parse message payload: { from, type, text/button_reply/list_reply }
3. Check if sender's IP / number is blocked → ignore if blocked
4. Fetch current session from chatbot_sessions table
5. Route to correct flow handler based on (current_flow, current_step)
6. Generate response
7. POST response to WATI send message API
8. INSERT inbound + outbound messages to chatbot_logs
9. UPSERT session state to chatbot_sessions
```

---

### 10.3 Conversation Flows

#### Flow 0 — Greeting (any first message or keyword: "hi", "hello", "menu", "start")

```
👋 Welcome to GujjOverseas LLP!
We export premium products from India to the world. 🌏

How can I help you today?

1️⃣  Browse by Category
2️⃣  Search for a Product
3️⃣  Get a Price Quote
4️⃣  Send an Inquiry / Order
5️⃣  Talk to a Human Agent
```

Session state: `{ current_flow: "greeting", current_step: 0 }`

---

#### Flow 1 — Browse by Category

**Step 1:** Send category list (fetched live from `categories` table, `is_visible = true`)

```
Please select a category:

• 🌱 Agro Products
• ✂️  Textiles
• 🎨 Handicrafts
• 💎 Imitation Jewellery
• 🌶️  Spices & Herbs
• 🔙 Back to Menu
```

**Step 2:** On category selection → fetch products for that category (`is_visible = true`) → send list of product names (max 10)

**Step 3:** On product selection → fetch full product → send product card:

```
🌾 *{Product Name}*        [🆕 NEW] ← shown if is_new_arrival = true
📍 Origin: {origin}
🏷️ Category: {category}

{short_description}

📦 Specifications:
• MOQ: {specs.MOQ}
• Packaging: {specs.Packaging}
• [other specs...]

Interested in this product?
[📩 Send Inquiry]   [💰 Get Price Quote]   [🔙 Back]
```

---

#### Flow 2 — Search for a Product

**Step 1:** Bot asks: `"Please type the product name you're looking for:"`

**Step 2:** Query:
```sql
SELECT * FROM products
WHERE (name ILIKE '%{input}%' OR tags::text ILIKE '%{input}%')
AND is_visible = true
LIMIT 5
```

**Step 3a — Results found:** Send list of matching products → user selects one → send product card (same as Flow 1 Step 3)

**Step 3b — No results:**
```
Sorry, we couldn't find "{input}" in our current catalog. 😊

Would you like to:
1️⃣  Browse all categories
2️⃣  Send a custom inquiry anyway
3️⃣  Talk to a human
```

---

#### Flow 3 — Get a Price Quote

**Step 1:** Bot asks: `"Which product are you interested in?"`
**Step 2:** Bot asks: `"What quantity do you need? (e.g. 500kg, 1 Ton, 200 pieces)"`
**Step 3:** Bot asks: `"Which country will this be shipped to?"`
**Step 4:** Bot asks: `"What's your name and company name?"`
**Step 5:** Bot asks: `"What's your email address?"`

On completion:
- INSERT into `inquiries` (source: `chatbot`, pipeline_stage: `new`)
- Notify Admin dashboard
- Send confirmation:

```
✅ Price quote request received!

*Summary:*
• Product: {product}
• Quantity: {quantity}
• Destination: {country}
• Name: {name}
• Email: {email}

Our team will send you a detailed price quote within 24 business hours. 🙏

Meanwhile, explore our full catalog:
👉 gujjoverseasllp.com/products
```

---

#### Flow 4 — Send an Inquiry / Order

**Step 1:** `"What's your full name?"`
**Step 2:** `"What's your company name? (Type 'skip' to continue)"`
**Step 3:** `"Which product and category are you interested in?"`
**Step 4:** `"How much quantity do you need?"`
**Step 5:** `"Destination country?"`
**Step 6:** `"Your email address?"`

On completion:
- INSERT into `inquiries`
- Trigger Admin dashboard notification
- Send confirmation message (same format as Flow 3)

---

#### Flow 5 — Talk to a Human Agent

**During working hours** (from `site_settings.chatbot_working_hours`):
```
Connecting you to our team now... 🙏
One moment please.
```
→ Assign conversation to human inbox in WATI

**Outside working hours:**
```
Our team is currently offline. 🌙
Working hours: {chatbot_working_days}, {chatbot_working_hours} IST

We'll get back to you first thing when we're back!

Meanwhile:
[📦 Browse Products]   [📩 Send Inquiry]
```
→ Capture inquiry if user chooses that option

---

#### Flow 6 — Fallback (unrecognised input)

```
Sorry, I didn't quite understand that. 😊

Type *menu* anytime to see options, or choose:
[📦 Browse]   [🔍 Search]   [📩 Inquire]   [👤 Human]
```

---

### 10.4 Session State Management

Store in `chatbot_sessions` table. Reset session on:
- User types "menu", "hi", "hello", "start"
- 30 minutes of inactivity (check `last_active` field)

```json
{
  "whatsapp_number": "+91XXXXXXXXXX",
  "current_flow": "inquiry",
  "current_step": 3,
  "collected_data": {
    "name": "Raj Patel",
    "company": "ABC Imports LLC",
    "product": "Cumin Seeds"
  },
  "last_active": "2026-06-14T10:30:00Z"
}
```

---

## 11. Security Implementation

### 11.1 Middleware (`middleware.ts`)

```typescript
// Protect all /secure/* routes
// Check valid Supabase session token in cookie
// Check role matches required portal (admin vs superadmin)
// Check IP not in blocked_ips table
// Redirect to correct login if any check fails
// Log every access attempt to audit_logs
```

### 11.2 Rate Limiting (Upstash Redis)

```typescript
// Key: `ratelimit:login:{ip_address}`
// Window: 15 minutes
// Limit: 5 requests
// On exceed: HTTP 429, INSERT blocked_ips, return lockout message
```

### 11.3 SuperAdmin 2FA

```typescript
// On account creation: generate TOTP secret with otplib
// Display QR code once for Google Authenticator setup
// Store encrypted secret in users.totp_secret
// On login step 2: verify 6-digit code with otplib.authenticator.verify()
// Issue session only on success
```

### 11.4 Input Sanitization (all admin API routes)

```typescript
import DOMPurify from 'isomorphic-dompurify';
// Strip all HTML from text fields before DB write
// Validate image MIME type: jpeg | png | webp only
// Validate image size: max 5MB
// Validate slugs: /^[a-z0-9-]+$/ pattern
// Validate email format on all email fields
```

### 11.5 Content Security Policy (`next.config.js`)

```javascript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "script-src 'self' 'unsafe-eval' https://sentry.io",
      "connect-src 'self' https://*.supabase.co https://sentry.io https://*.upstash.io",
      "frame-src 'none'"
    ].join('; ')
  }
];
```

### 11.6 Row-Level Security (Supabase RLS)

```sql
-- Public can only read visible products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_visible"
ON products FOR SELECT TO anon
USING (is_visible = true);

-- Authenticated admins/superadmins can do everything on products
CREATE POLICY "admins_full_access"
ON products FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin','superadmin')
    AND is_active = true)
);

-- Only superadmin can read audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "superadmin_only_audit"
ON audit_logs FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'superadmin')
);

-- Only superadmin can manage users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "superadmin_manage_users"
ON users FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'superadmin')
);

-- Admins and superadmins can read/write inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_manage_inquiries"
ON inquiries FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin','superadmin')
    AND is_active = true)
);

-- Public can insert inquiries (from contact form)
CREATE POLICY "public_insert_inquiry"
ON inquiries FOR INSERT TO anon
WITH CHECK (true);
```

---

## 12. Environment Variables

Store all of these in Vercel project settings (never commit to Git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# WATI WhatsApp
WATI_API_ENDPOINT=https://live-mt-server.wati.io/{your-account-id}
WATI_API_TOKEN=
WATI_WEBHOOK_SECRET=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Sentry (error tracking)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# Email notifications (via Supabase Auth or Resend)
RESEND_API_KEY=

# App URL
NEXT_PUBLIC_APP_URL=https://gujjoverseasllp.com
```

---

## 13. Hosting & Deployment

### 13.1 GitHub Repository

```
Repository name: gujjoverseasllp-website (private)

Branch strategy:
  main    → production (auto-deploys to Vercel)
  dev     → staging (Vercel preview URL)
  feature/* → PRs into dev
```

### 13.2 Vercel Setup

1. Connect GitHub repo to Vercel project
2. Set all environment variables in Vercel dashboard
3. Add custom domain `gujjoverseasllp.com` in Vercel → Domains
4. Vercel auto-provisions SSL certificate (free, automatic)
5. Enable Vercel Analytics in project settings

### 13.3 DNS Configuration

Add these records in your domain registrar (Hostinger / GoDaddy):

```
Type    Name    Value                       TTL
A       @       76.76.19.19                 Auto
CNAME   www     cname.vercel-dns.com        Auto
```

DNS propagation: up to 24 hours. Check with `dig gujjoverseasllp.com`.

### 13.4 Supabase Setup

1. Create new Supabase project (region: Mumbai `ap-south-1` for low latency)
2. Run all SQL from Section 5 in Supabase SQL Editor
3. Create Storage bucket `product-images`: Public read, authenticated write
4. Enable Email Auth provider in Supabase Auth settings
5. Configure Auth email templates for: invite, password reset, magic link
6. Copy URL and keys to Vercel environment variables

### 13.5 WATI Setup

1. Sign up at wati.io
2. Connect Meta Business Manager
3. Verify WhatsApp Business number
4. Set webhook URL to `https://gujjoverseasllp.com/api/chatbot/webhook`
5. Copy API token to Vercel environment variables
6. Configure working hours in WATI and also in Supabase `site_settings`

---

## 14. Development Phases & Timeline

| Phase | What Gets Built | Estimated Time |
|---|---|---|
| Phase 1 | New hero section, navbar, category grid, stats bar, feature strip | 3–4 days |
| Phase 2 | Genre change throughout — text, SEO, categories, product cards | 2 days |
| Phase 3 | Supabase schema updates — new tables, seed categories, RLS policies | 1–2 days |
| Phase 4 | Public website pages — Categories page, Category detail page, updated Product pages | 3–4 days |
| Phase 5 | Admin portal — all new features: pipeline, templates, analytics, media library, CSV import/export | 5–6 days |
| Phase 6 | SuperAdmin portal — appearance control, banner, SEO, backup, category management, sessions | 5–6 days |
| Phase 7 | WhatsApp chatbot — webhook handler, all 6 flows, session management, WATI integration | 5–6 days |
| Phase 8 | Security hardening — rate limiting, 2FA, CSP headers, RLS audit, IP blocking | 2–3 days |
| Phase 9 | Integrations — Sentry, Vercel Analytics, weekly auto-report email | 2 days |
| Phase 10 | Testing, Lighthouse audit, cross-browser, mobile QA, go-live | 3–4 days |
| **Total** | | **~31–37 days** |

---

## 15. Cost Breakdown

| Item | Cost | Paid To | Frequency |
|---|---|---|---|
| Domain `gujjoverseasllp.com` | ~₹900/year | Hostinger / GoDaddy | Yearly |
| Domain `gujjoverseasllp.in` (recommended) | ~₹500/year | Same registrar | Yearly |
| Vercel Hosting | ₹0 | Vercel | Free tier |
| Supabase DB + Storage + Auth | ₹0 | Supabase | Free tier |
| SSL Certificate | ₹0 | Vercel (auto) | Free |
| Sentry Error Tracking | ₹0 | Sentry | Free tier |
| Vercel Analytics | ₹0 | Vercel | Free tier |
| Upstash Redis (rate limiting) | ₹0 | Upstash | Free tier |
| **WATI WhatsApp Platform** | **~₹2,500/month** | WATI | Monthly |
| Meta WhatsApp Business API | ₹0 | Meta | Free |
| **Total without chatbot** | **~₹900–1,400/year** | | |
| **Total with chatbot** | **~₹31,400/year** | | |

> Upgrade Vercel (paid) only if traffic exceeds 100GB/month bandwidth.
> Upgrade Supabase (paid ~$25/month) only if database exceeds 500MB or storage exceeds 1GB.
> Both are good problems — they mean the business is growing.

---

## 16. Pending Assets from Client

Development proceeds with placeholders for all items below. These must be provided before the site can go fully live.

| Asset | Format | Where Used | Status |
|---|---|---|---|
| Company logo | PNG, transparent background | Navbar, footer, all pages | Pending |
| WhatsApp Business number | International format `+91XXXXXXXXXX` | Contact buttons, chatbot, navbar | Pending |
| Contact email | e.g. `info@gujjoverseasllp.com` | Contact page, email button | Pending (confirm existing) |
| Contact phone number | With country code | Navbar, contact page | Pending (confirm existing) |
| Company address | Full with city, state, PIN | Contact page, footer | Pending |
| Hero background image | High-res landscape, export themed | Homepage hero | Pending |
| Product list | Name, description, images, origin, specs per product | All product pages + chatbot | Pending |
| Certification images | FSSAI, APEDA, ISO, GST, MSME logos | Homepage, about page | Pending |
| About Us content | Company story, founding year, markets served | About page | Pending |
| Founder / team info | Name, designation, photo (optional) | About page | Pending |
| OG / share image | 1200×630px JPG | Social media previews when link is shared | Pending |

---

*This document supersedes v1.0. All specifications here are final unless the client requests changes. Begin with Phase 1 and confirm completion with the client before moving to Phase 2. Questions? Contact the project owner before starting any phase.*
