# GujjOverseasLLP — Full Implementation Specification
### Prepared for: Antigravity Development Team
**Version:** 2.0  
**Company:** GujjOverseas LLP  
**Domain:** gujjoverseasllp.com  
**Industry:** Agro Products Export  
**Last Updated:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema](#3-database-schema)
4. [Public Website Implementation](#4-public-website-implementation)
5. [Admin Portal Implementation](#5-admin-portal-implementation)
6. [SuperAdmin Portal Implementation](#6-superadmin-portal-implementation)
7. [WhatsApp Chatbot Implementation](#7-whatsapp-chatbot-implementation)
8. [Security Implementation](#8-security-implementation)
9. [Hosting & Deployment](#9-hosting--deployment)
10. [Development Phases](#10-development-phases)
11. [Cost Summary](#11-cost-summary)
12. [Pending Assets](#12-pending-assets)

---

## 1. Project Overview

Build a production-ready, SEO-optimized website for **GujjOverseas LLP**, an agro products export company. The project consists of four major components:

- A **public-facing website** to showcase agro products to international buyers
- A **secure Admin portal** for the founder to manage products and inquiries
- A **secure SuperAdmin portal** for full system control, audit trails, and user management
- A **WhatsApp chatbot** integrated with the product database to handle customer queries, product discovery, and inquiry collection automatically

All components must be built on the same codebase (Next.js 14) and share the same Supabase backend.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) | All public + admin pages |
| Styling | Tailwind CSS | Responsive, utility-first |
| Database | Supabase (PostgreSQL) | Primary data store |
| Authentication | Supabase Auth + JWT + RBAC | Role-based: admin / superadmin |
| File Storage | Supabase Storage | Product images |
| 2FA | TOTP (Google Authenticator) | SuperAdmin only |
| Rate Limiting | Upstash Redis + Vercel Middleware | Login brute-force protection |
| Error Tracking | Sentry | Frontend + backend |
| Analytics | Vercel Analytics | Page views, traffic |
| WhatsApp Platform | WATI (on Meta WhatsApp Business API) | Chatbot + human inbox |
| Hosting | Vercel | Auto-deploy from GitHub |
| Domain Registrar | Hostinger / GoDaddy | gujjoverseasllp.com |

---

## 3. Database Schema

Create all tables in Supabase. Apply Row-Level Security (RLS) policies as described in Section 8.

```sql
-- -------------------------------------------------------
-- PRODUCTS
-- -------------------------------------------------------
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  category       TEXT,
  short_description TEXT,
  description    TEXT,
  origin         TEXT,
  specs          JSONB,           -- e.g. {"MOQ": "1 Ton", "Packaging": "25kg bags"}
  images         TEXT[],          -- array of Supabase Storage URLs
  primary_image  TEXT,            -- URL of the main display image
  tags           TEXT[],          -- for search and filtering
  is_visible     BOOLEAN DEFAULT true,
  is_featured    BOOLEAN DEFAULT false,
  meta_title     TEXT,            -- SEO
  meta_description TEXT,          -- SEO
  scheduled_at   TIMESTAMPTZ,     -- optional future publish date
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------------------
-- CATEGORIES
-- -------------------------------------------------------
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------------------
-- USERS (Admins and SuperAdmins)
-- -------------------------------------------------------
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        TEXT CHECK (role IN ('admin', 'superadmin')) NOT NULL,
  permissions JSONB DEFAULT '{}',  -- granular per-user overrides
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  last_login  TIMESTAMPTZ
);

-- -------------------------------------------------------
-- SITE SETTINGS
-- -------------------------------------------------------
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,    -- e.g. "whatsapp_number", "contact_email"
  value      TEXT NOT NULL,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default settings rows
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', ''),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('company_address', ''),
  ('homepage_banner', ''),
  ('banner_enabled', 'false'),
  ('maintenance_mode', 'false'),
  ('company_tagline', ''),
  ('hero_text', '');

-- -------------------------------------------------------
-- CUSTOMER INQUIRIES
-- -------------------------------------------------------
CREATE TABLE inquiries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     TEXT,
  company_name      TEXT,
  whatsapp_number   TEXT,
  email             TEXT,
  product_name      TEXT,
  quantity          TEXT,
  destination_country TEXT,
  message           TEXT,
  source            TEXT CHECK (source IN ('chatbot', 'contact_form', 'direct')),
  status            TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------------------
-- AUDIT LOGS (append-only — no UPDATE or DELETE ever)
-- -------------------------------------------------------
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,   -- e.g. "product.create", "setting.update", "user.deactivate"
  target      TEXT,            -- e.g. product slug or setting key
  payload     JSONB,           -- before/after snapshot
  ip_address  TEXT,
  user_agent  TEXT,
  timestamp   TIMESTAMPTZ DEFAULT now()
);

-- Revoke DELETE and UPDATE on audit_logs for all roles
REVOKE UPDATE, DELETE ON audit_logs FROM authenticated;
REVOKE UPDATE, DELETE ON audit_logs FROM service_role;

-- -------------------------------------------------------
-- LOGIN ATTEMPTS
-- -------------------------------------------------------
CREATE TABLE login_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT,
  ip_address  TEXT,
  success     BOOLEAN,
  timestamp   TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------------------
-- CHATBOT CONVERSATION LOGS
-- -------------------------------------------------------
CREATE TABLE chatbot_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  direction       TEXT CHECK (direction IN ('inbound', 'outbound')),
  message         TEXT,
  message_type    TEXT,        -- "text", "image", "button_reply", "list_reply"
  session_id      TEXT,        -- group messages per conversation session
  timestamp       TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------------------
-- BLOCKED IPs
-- -------------------------------------------------------
CREATE TABLE blocked_ips (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT UNIQUE NOT NULL,
  reason     TEXT,
  blocked_by UUID REFERENCES users(id),
  blocked_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Public Website Implementation

### 4.1 Pages

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero, featured products, certifications, contact strip |
| `/products` | Products Listing | Full grid with category filter and search |
| `/products/[slug]` | Product Detail | Full product info, image gallery, inquiry button |
| `/about` | About Us | Company story, certifications, founder section |
| `/contact` | Contact | WhatsApp, email, phone, address, inquiry form |

---

### 4.2 Homepage (`/`)

Implement the following sections in order:

**Navbar**
- Company logo (left)
- Navigation links: Home, Products, About, Contact
- Sticky on scroll
- Mobile hamburger menu

**Hero Section**
- Full-width background image (agro/export themed)
- Company name and tagline (loaded from `site_settings` table — key: `hero_text`, `company_tagline`)
- Two CTA buttons: "Browse Products" → `/products` and "Contact Us" → `/contact`

**Featured Products Section**
- Fetch products where `is_featured = true` and `is_visible = true`
- Display max 6 products in a responsive grid
- Each card: primary image, name, category, short description, "View Details" button

**Trust Signals Section**
- Display certification badges: FSSAI, APEDA, ISO
- Images stored in Supabase Storage
- Brief tagline: "Trusted by buyers across 20+ countries"

**About Snippet**
- Short paragraph about the company
- "Read More" button → `/about`

**Contact Strip**
- WhatsApp button: deep link to `https://wa.me/{whatsapp_number}` (loaded from `site_settings`)
- Email button: `mailto:{contact_email}`
- Phone: `tel:{contact_phone}`

**Footer**
- Company name, tagline
- Navigation links
- Social media icons
- Copyright notice

---

### 4.3 Products Page (`/products`)

- Fetch all products where `is_visible = true` from Supabase
- Display in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- **Category filter:** Fetch all categories, render as filter pills. Clicking a category filters the grid client-side
- **Search bar:** Live search by product name and tags (client-side filter)
- Each product card: primary image, name, category badge, short description, "View Details" button
- Empty state message if no products match filter

---

### 4.4 Product Detail Page (`/products/[slug]`)

- Fetch product by slug from Supabase
- Generate static paths with `generateStaticParams` for SEO
- Use `meta_title` and `meta_description` from product row for page `<head>`

**Layout:**
- Left: Image gallery (primary image large, thumbnails below, click to switch)
- Right: Product name, category badge, origin, short description
- Full description section below
- Specifications table (rendered from `specs` JSONB field)
- Tags displayed as pills
- WhatsApp Inquiry button: deep link pre-filled with product name — `https://wa.me/{number}?text=Hi, I'm interested in {product_name}`
- Related products section: fetch 3 products from same category

---

### 4.5 About Page (`/about`)

- Company story paragraph
- Founding year, export destinations
- Certifications section with logos
- Founder / team section (placeholder until content provided)

---

### 4.6 Contact Page (`/contact`)

- WhatsApp button, Email button, Phone number, Company address
- Inquiry form fields: Full Name, Email, WhatsApp Number, Product of Interest (dropdown from categories), Message
- On form submit: INSERT into `inquiries` table with `source = 'contact_form'`
- Show success message after submission
- Input validation and sanitization before DB write

---

## 5. Admin Portal Implementation

**Base URL:** `/secure/admin`  
**Access:** Hidden — not linked from public site anywhere  
**Auth:** Supabase Auth session with role check (`role = 'admin'` or `role = 'superadmin'`)  
**Middleware:** Protect all `/secure/admin/*` routes — redirect to login if no valid session

---

### 5.1 Login Page (`/secure/admin/login`)

- Email + password fields
- On submit: call Supabase Auth `signInWithPassword`
- Check user role from `users` table — reject if role is neither `admin` nor `superadmin`
- On success: INSERT into `login_attempts` (success: true), send login notification email to the user
- On failure: INSERT into `login_attempts` (success: false)
- Rate limiting: block IP after 5 failed attempts in 15 minutes using Upstash Redis
- Session timeout: auto sign-out after 1 hour of inactivity

---

### 5.2 Dashboard (`/secure/admin/dashboard`)

Fetch and display:

- Total products count (split: visible vs hidden)
- Live visitor count (from Vercel Analytics API)
- Page visits chart — last 7 days and last 30 days
- Top 5 most viewed products with view counts
- Recent activity feed — last 10 entries from `audit_logs` where `user_id = current user`
- New inquiries count badge (unread inquiries from `inquiries` table)
- Quick action buttons:
  - "Add Product" → `/secure/admin/products/new`
  - "View Inquiries" → `/secure/admin/inquiries`
  - "Chatbot Logs" → `/secure/admin/chatbot`

---

### 5.3 Products List (`/secure/admin/products`)

- Fetch all products from Supabase, display in a sortable table
- Columns: Thumbnail, Name, Category, Status (Visible / Hidden / Draft), Featured, Created Date, Actions
- Sorting: click column headers to sort
- Search: live filter by name
- Actions per row:
  - Edit (→ edit page)
  - Delete (confirmation modal, then DELETE from DB + log to audit_logs)
  - Toggle Visibility (PATCH `is_visible`, log to audit_logs)
  - Toggle Featured (PATCH `is_featured`, log to audit_logs)
  - Duplicate (INSERT copy of product with new slug, log to audit_logs)
  - Preview (opens `/products/[slug]` in new tab)
- Bulk actions (checkboxes): bulk hide, bulk show, bulk delete
- "Add New Product" button top right

---

### 5.4 Add Product (`/secure/admin/products/new`)

Form fields:

| Field | Type | Notes |
|---|---|---|
| Name | Text input | Required |
| Slug | Text input | Auto-generated from name, editable |
| Category | Dropdown | Fetched from `categories` table |
| Short Description | Textarea | Max 160 chars |
| Full Description | Rich text editor (Tiptap or Quill) | |
| Origin | Text input | e.g. "Gujarat, India" |
| Specifications | Dynamic key-value pair builder | Add/remove rows |
| Tags | Tag input | Comma-separated |
| Images | Drag-and-drop multi-upload | Uploaded to Supabase Storage |
| Primary Image | Radio select from uploaded images | |
| Image Order | Drag to reorder | |
| Meta Title | Text input | SEO — defaults to product name |
| Meta Description | Textarea | SEO — max 160 chars |
| Visibility | Toggle | Visible / Hidden |
| Featured | Toggle | Show on homepage |
| Schedule Publish | Date/time picker | Optional — publish at future time |

On submit:
- Validate all required fields
- Sanitize all text inputs
- Upload images to Supabase Storage bucket `product-images`
- INSERT product row into `products` table
- INSERT action into `audit_logs`: `action = "product.create"`, `target = slug`
- Redirect to products list with success toast

---

### 5.5 Edit Product (`/secure/admin/products/[id]/edit`)

- Pre-fill all fields from existing product row
- Image management: view existing images, delete individual images, upload new ones, reorder
- On save:
  - PATCH product row in `products` table
  - UPDATE `updated_at` timestamp
  - INSERT into `audit_logs`: `action = "product.update"`, `payload = {before: {...}, after: {...}}`
- "Delete Product" button at bottom with confirmation modal

---

### 5.6 Categories Management (`/secure/admin/categories`)

- View all categories in a list
- Add new category (name → auto slug)
- Rename category
- Delete category (with warning if products are assigned to it)
- All changes logged to `audit_logs`

---

### 5.7 Inquiry Management (`/secure/admin/inquiries`)

- Table of all rows from `inquiries` table
- Columns: Date, Customer Name, WhatsApp, Product, Source (chatbot / form), Status, Actions
- Filter by status: New, Read, Replied, Archived
- Actions per row:
  - Mark as Read (PATCH status)
  - Mark as Replied (PATCH status)
  - Archive (PATCH status)
  - Reply via WhatsApp (opens `wa.me` link with customer number)
  - Reply via Email (opens `mailto:` link)
- Unread inquiry count shown as badge in sidebar nav

---

### 5.8 Chatbot Logs (`/secure/admin/chatbot`)

- View paginated conversation logs from `chatbot_logs` table
- Group messages by `session_id` to show full conversations
- Filter by date range or phone number
- See most asked questions (aggregate by message content)
- Edit quick-reply answers (stored in WATI platform — link to WATI dashboard)
- Toggle chatbot on/off (PATCH `site_settings` key: `chatbot_enabled`)

---

### 5.9 Media Library (`/secure/admin/media`)

- Grid view of all images in Supabase Storage bucket
- Shows file name, size, upload date
- Delete unused images
- Storage usage bar (used / 1GB total)

---

## 6. SuperAdmin Portal Implementation

**Base URL:** `/secure/superadmin`  
**Access:** Hidden — not linked anywhere  
**Auth:** Supabase Auth session + TOTP 2FA verification + role check (`role = 'superadmin'`)  
**Middleware:** Protect all `/secure/superadmin/*` routes

Includes all Admin portal pages, plus the following:

---

### 6.1 Login Page (`/secure/superadmin/login`)

- Email + password, then TOTP code (second step)
- TOTP verified using `otplib` library server-side
- Optional: YubiKey hardware security key as alternative 2FA
- On login success: send alert email to SuperAdmin
- Same rate limiting as Admin login

---

### 6.2 Audit Logs (`/secure/superadmin/audit-logs`)

- Fetch all rows from `audit_logs` table (paginated, newest first)
- Columns: Timestamp, User Email, Action, Target, IP Address, User Agent
- Filters: date range picker, user dropdown, action type dropdown
- Auto-flag suspicious entries (highlight rows where >10 actions from same user in <1 min)
- Export current filtered view to CSV
- Export to PDF option

---

### 6.3 User Management (`/secure/superadmin/users`)

- Table of all rows from `users` table
- Columns: Name, Email, Role, Status (Active/Inactive), Last Login, Actions
- Actions per row:
  - Edit name / role
  - Deactivate account (PATCH `is_active = false`) — user immediately cannot log in
  - Reactivate account
  - Force logout (invalidate all active sessions via Supabase Auth admin API)
  - View full login history for that user (filter `login_attempts` by email)
  - Edit granular permissions (PATCH `permissions` JSONB field)
- "Add New Admin" button: form with name, email, temporary password, role selection
- New Admin receives a setup email via Supabase Auth invite

---

### 6.4 Site Settings (`/secure/superadmin/settings`)

Editable fields loaded from and saved to `site_settings` table:

| Setting Key | Label | Input Type |
|---|---|---|
| `whatsapp_number` | WhatsApp Number | Text |
| `contact_email` | Contact Email | Email |
| `contact_phone` | Phone Number | Text |
| `company_address` | Company Address | Textarea |
| `homepage_banner` | Banner Message | Text |
| `banner_enabled` | Show Banner | Toggle |
| `company_tagline` | Company Tagline | Text |
| `hero_text` | Hero Section Text | Textarea |
| `maintenance_mode` | Maintenance Mode | Toggle |
| `chatbot_enabled` | Chatbot Active | Toggle |
| `chatbot_working_hours` | Chatbot Hours | Time range picker |

- On save: PATCH `site_settings` rows + INSERT into `audit_logs`
- Maintenance mode toggle: when enabled, public site shows a branded "Coming Soon" page to all visitors

---

### 6.5 Analytics & Reports (`/secure/superadmin/analytics`)

- Full traffic analytics from Vercel Analytics API:
  - Top pages by views
  - Traffic sources (direct, search, referral)
  - Device breakdown (mobile / desktop)
  - Country breakdown
- Product performance: views and inquiry count per product
- Chatbot performance:
  - Total conversations
  - Resolution rate (chatbot resolved vs handed to human)
  - Most asked questions
  - Busiest hours heatmap
- Export any report to CSV or PDF
- Weekly auto-report: send summary email to SuperAdmin every Monday

---

### 6.6 Crash Reports (`/secure/superadmin/crash-reports`)

- Embed Sentry issues feed via Sentry API or iframe
- Columns: Error, Frequency, Users Affected, First Seen, Last Seen, Status
- Mark errors as resolved
- Critical error email alerts auto-sent by Sentry (configure in Sentry project settings)

---

### 6.7 Login Attempts (`/secure/superadmin/login-attempts`)

- Fetch all rows from `login_attempts` table (paginated)
- Columns: Timestamp, Email Used, IP Address, Success/Fail
- Filter by IP address or email
- "Block IP" button per row: INSERT into `blocked_ips` table
- View currently blocked IPs with option to unblock

---

### 6.8 Active Sessions (`/secure/superadmin/sessions`)

- List all currently active logged-in Admin/SuperAdmin sessions
- Columns: User, Role, Login Time, Last Activity, IP
- "Force Logout" button: revoke session token via Supabase Auth admin API

---

## 7. WhatsApp Chatbot Implementation

### 7.1 Platform Setup

Use **WATI** (WhatsApp Team Inbox) built on the official Meta WhatsApp Business API.

Setup steps:
1. Register on [wati.io](https://wati.io) and connect Meta Business account
2. Verify WhatsApp Business number
3. Configure webhook URL: `https://gujjoverseasllp.com/api/chatbot/webhook`
4. Store WATI API key in environment variables

---

### 7.2 Webhook Handler (`/api/chatbot/webhook`)

Create a Next.js API route that:
- Receives POST requests from WATI on every incoming message
- Verifies the request signature using WATI webhook secret
- Reads the message type and content
- Determines the current conversation state (stored in `chatbot_sessions` or in-memory cache)
- Routes to the appropriate flow handler
- Calls WATI API to send response messages back
- Logs every inbound and outbound message to `chatbot_logs` table

---

### 7.3 Conversation Flows

#### Flow 1 — Greeting (triggered on any first message or "menu" keyword)

Send an interactive list message:

```
👋 Welcome to GujjOverseas!
We export premium agro products worldwide. 🌾

How can I help you today?

1️⃣  Browse Products by Category
2️⃣  Search for a Specific Product
3️⃣  Send an Inquiry / Order Request
4️⃣  Talk to a Human Agent
```

---

#### Flow 2 — Browse Products by Category

Step 1: Fetch all categories from Supabase. Send as interactive button/list:
```
Please select a category:
• Grains & Cereals
• Spices & Herbs
• Pulses & Legumes
• Dry Fruits & Nuts
• Others
```

Step 2: On category selection, fetch products where `category = selected` and `is_visible = true`. Send list of product names.

Step 3: On product selection, fetch full product from Supabase by slug. Send product card:
```
🌾 *{Product Name}*
📍 Origin: {origin}
🏷️ Category: {category}

{short_description}

📦 Key Specs:
• MOQ: {specs.MOQ}
• Packaging: {specs.Packaging}
[...other specs]

Would you like to:
[📩 Send Inquiry]   [🔙 Back to Menu]
```

---

#### Flow 3 — Search for a Specific Product

Step 1: Bot asks:
```
Please type the product name you're looking for:
```

Step 2: Search Supabase — `SELECT * FROM products WHERE name ILIKE '%{input}%' AND is_visible = true LIMIT 5`

Step 3a — Match found: send product card (same format as Flow 2 Step 3)

Step 3b — No match:
```
Sorry, we couldn't find "{input}" in our catalog right now.

Would you like to:
1️⃣  Send a custom inquiry anyway
2️⃣  Browse all categories
3️⃣  Talk to a human
```

---

#### Flow 4 — Send an Inquiry / Order Request

Bot collects the following via sequential messages:

```
Step 1: "What's your full name?"
Step 2: "What's your company name? (Type 'skip' if individual)"
Step 3: "Which product are you interested in, and how much quantity do you need?"
Step 4: "Which country will this be shipped to?"
Step 5: "What's your email address?"
```

On completion:
- INSERT row into `inquiries` table with `source = 'chatbot'`
- Trigger Supabase webhook → notify Admin dashboard (increment unread badge)
- Send confirmation to customer:

```
✅ Thank you, {name}!

Your inquiry has been received. Our team will contact you within 24 business hours.

Inquiry Summary:
• Product: {product}
• Quantity: {quantity}
• Destination: {country}
• Email: {email}

In the meantime, explore our full catalog:
👉 gujjoverseasllp.com/products
```

---

#### Flow 5 — Talk to a Human Agent

During working hours (loaded from `site_settings.chatbot_working_hours`):
```
Connecting you to our team now... 🙏
Please hold for a moment.
```
→ Hand off conversation to WATI human inbox (assign to available agent)

Outside working hours:
```
Our team is currently offline. 🌙
Working hours: Mon–Sat, 9AM–6PM IST

We'll get back to you first thing tomorrow!

Meanwhile, you can browse our products:
👉 gujjoverseasllp.com/products

Or send your inquiry and we'll reply when we're back:
[📩 Send Inquiry]
```

---

#### Flow 6 — Fallback (unrecognised input)

```
Sorry, I didn't understand that. 😊

Type *menu* anytime to see your options, or choose below:
[🔍 Browse Products]   [📩 Send Inquiry]   [👤 Talk to Human]
```

---

### 7.4 Chatbot State Management

Track conversation state per user in Supabase or Redis:

```json
{
  "whatsapp_number": "+91XXXXXXXXXX",
  "current_flow": "inquiry",
  "current_step": 3,
  "collected_data": {
    "name": "John Doe",
    "company": "ABC Imports",
    "product": "Cumin Seeds"
  },
  "last_active": "2026-06-12T10:30:00Z"
}
```

Reset state on "menu" keyword or after 30 minutes of inactivity.

---

### 7.5 Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WATI_API_ENDPOINT=
WATI_API_TOKEN=
WATI_WEBHOOK_SECRET=
SENTRY_DSN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 8. Security Implementation

### 8.1 Route Protection

Create a Next.js middleware file (`middleware.ts`) that:
- Intercepts all requests to `/secure/*`
- Checks for a valid Supabase session token in cookies
- Reads the user's role from the JWT claims
- Redirects to the appropriate login page if no valid session
- Redirects to 404 if role does not match the required portal (Admin trying to access SuperAdmin routes)

### 8.2 Rate Limiting

Using Upstash Redis in the login API route:
- Key: `ratelimit:login:{ip_address}`
- Limit: 5 requests per 15-minute window
- On limit exceeded: return HTTP 429, INSERT blocked IP into `blocked_ips`, show lockout message

### 8.3 2FA for SuperAdmin

- On SuperAdmin account creation: generate TOTP secret, display QR code once for Google Authenticator setup
- Store encrypted TOTP secret in `users` table
- On SuperAdmin login: after password auth, require 6-digit TOTP code
- Verify TOTP server-side using `otplib`
- Issue session token only after TOTP verified

### 8.4 Input Sanitization

On all Admin form submissions (server-side API routes):
- Strip HTML tags from all text fields using `DOMPurify` (server-side via `isomorphic-dompurify`)
- Validate file uploads: accept only `image/jpeg`, `image/png`, `image/webp`, max 5MB per file
- Validate all slugs match pattern `/^[a-z0-9-]+$/`

### 8.5 Content Security Policy Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' data: https://*.supabase.co; script-src 'self' 'unsafe-eval'; connect-src 'self' https://*.supabase.co https://sentry.io;"
  }
];
```

### 8.6 Row-Level Security (RLS) Policies

```sql
-- Admins can only read/write products
CREATE POLICY "admins_manage_products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
    AND is_active = true
  )
);

-- Only superadmin can read audit_logs
CREATE POLICY "superadmin_read_audit"
ON audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- No one can delete or update audit_logs (enforced by REVOKE above)

-- Only superadmin can manage users table
CREATE POLICY "superadmin_manage_users"
ON users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- Public can read visible products only
CREATE POLICY "public_read_visible_products"
ON products FOR SELECT
TO anon
USING (is_visible = true);
```

---

## 9. Hosting & Deployment

### 9.1 Repository Setup

- Create a private GitHub repository: `gujjoverseasllp-website`
- Branch strategy:
  - `main` → production (auto-deploys to Vercel)
  - `dev` → staging (auto-deploys to Vercel preview URL)
  - Feature branches → PRs into `dev`

### 9.2 Vercel Setup

1. Connect GitHub repo to Vercel project
2. Set all environment variables in Vercel dashboard (see Section 7.5)
3. Add custom domain `gujjoverseasllp.com` in Vercel domain settings
4. Vercel auto-provisions SSL certificate

### 9.3 DNS Configuration

In domain registrar (GoDaddy / Hostinger), add:

```
Type    Name    Value
A       @       76.76.19.19       (Vercel IP)
CNAME   www     cname.vercel-dns.com
```

### 9.4 Supabase Setup

1. Create new Supabase project
2. Run all SQL from Section 3 in Supabase SQL editor
3. Create Storage bucket `product-images` (public read, authenticated write)
4. Enable Supabase Auth email provider
5. Configure Auth email templates (invite, password reset)
6. Copy Supabase URL and keys to Vercel environment variables

---

## 10. Development Phases

| Phase | Deliverable | Dependencies |
|---|---|---|
| Phase 1 | Public website — all 5 pages, responsive, SEO | None |
| Phase 2 | Supabase setup — schema, auth, RLS, storage | Phase 1 |
| Phase 3 | Admin portal — login, dashboard, product CRUD, inquiries | Phase 2 |
| Phase 4 | SuperAdmin portal — audit logs, users, settings, analytics | Phase 3 |
| Phase 5 | WhatsApp chatbot — webhook, all flows, inquiry capture | Phase 2, WATI account |
| Phase 6 | Security hardening — rate limiting, 2FA, CSP, RLS audit | Phase 3 & 4 |
| Phase 7 | Integrations — Sentry, Vercel Analytics, weekly email report | Phase 4 |
| Phase 8 | Testing & deployment — Lighthouse audit, cross-browser, go live | All phases |

---

## 11. Cost Summary

| Item | Cost | Paid To | Frequency |
|---|---|---|---|
| Domain `gujjoverseasllp.com` | ~₹900/year | Hostinger / GoDaddy | Yearly |
| Domain `gujjoverseasllp.in` (optional) | ~₹500/year | Same registrar | Yearly |
| Vercel Hosting | ₹0 | Vercel | Free tier |
| Supabase DB + Storage | ₹0 | Supabase | Free tier |
| SSL Certificate | ₹0 | Vercel (auto) | Free |
| Sentry Error Tracking | ₹0 | Sentry | Free tier |
| Vercel Analytics | ₹0 | Vercel | Free tier |
| Upstash Redis (rate limiting) | ₹0 | Upstash | Free tier |
| **WATI WhatsApp Platform** | **~₹2,500/month** | WATI | Monthly |
| Meta WhatsApp Business API | ₹0 | Meta | Free |
| **Total (without chatbot)** | **~₹900–1,400/year** | | |
| **Total (with chatbot)** | **~₹31,000/year** | | |

> **Note:** The WATI plan is the only recurring paid cost. All other infrastructure runs on free tiers sufficient for launch and early growth. Upgrade Vercel or Supabase only if the site grows beyond 100GB/month bandwidth or 500MB database respectively.

---

## 12. Pending Assets

The following must be provided by the founder before the website can go fully live. Development proceeds with placeholders until received.

| Asset | Format | Used In |
|---|---|---|
| Company logo | PNG, transparent background | Navbar, footer, all pages |
| WhatsApp business number | International format e.g. `+91XXXXXXXXXX` | Contact buttons, chatbot |
| Contact email address | e.g. `info@gujjoverseasllp.com` | Contact page, email button |
| Contact phone number | With country code | Contact page |
| Company address | Full address with city, state, PIN | Contact page, footer |
| Product list | Name, description, images, origin, specs per product | Products pages, chatbot |
| Certification images | FSSAI, APEDA, ISO logo files | Homepage, About page |
| About Us content | Company story, founding year, export reach | About page |
| Hero section image | High-res, landscape, agro themed | Homepage hero |
| Founder / team info | Name, designation, photo (optional) | About page |

---

*This document is the complete implementation reference for the GujjOverseas LLP website project. All features, schemas, flows, and configurations described above should be implemented as specified. Contact the project owner for any clarifications before starting a new phase.*
