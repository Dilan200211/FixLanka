# FixLanka Mini — Sri Lankan Technician Directory

FixLanka Mini is a lightweight, mobile-first web directory helping citizens in Sri Lanka easily find and directly contact trusted local technicians (plumbers, electricians, AC technicians, appliance repairers, and more) across all 25 administrative districts.

---

## 🚀 Key Features

- **Bilingual Interface**: Native support for **Sinhala (සිංහල)** (default) and **English** with instant switching and persistent user preferences.
- **Service Categories**: 8 essential trade categories with clear visual icons and bilingual labels.
- **Location Filtering**: Full coverage of all 25 Sri Lankan administrative districts and search by town name.
- **Direct Contact**: One-tap phone calling (`tel:`) and WhatsApp messaging (`https://wa.me/`) with standardized `+94` phone formatting.
- **Security & Row Level Security (RLS)**: Public users can only read published listings and active categories; write operations strictly require server-validated admin credentials.
- **Lightweight & Mobile-First**: Built for low-bandwidth connections and budget smartphones without heavy animations or framework bloat.
- **Admin Dashboard**: Administrator portal for adding, editing, publishing/unpublishing, and deleting technician listings.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Auth**: Supabase PostgreSQL with Row Level Security & Supabase Auth
- **Deployment**: Vercel

---

## 📂 Project Structure

```
FixLanka/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Secure Supabase Auth admin login
│   │   │   └── page.tsx            # Admin listing management dashboard
│   │   ├── technicians/[id]/
│   │   │   └── page.tsx            # Technician profile page
│   │   ├── globals.css             # Design system tokens and styles
│   │   ├── layout.tsx              # Root HTML with Noto Sans Sinhala font
│   │   ├── page.tsx                # Homepage entry
│   │   └── providers.tsx           # Client providers (i18n, layout wrapper)
│   ├── components/
│   │   ├── CategoryCard.tsx        # Interactive category badge/button
│   │   ├── DistrictFilter.tsx      # 25-district selector & town search
│   │   ├── EmptyState.tsx          # Accessible "no results found" display
│   │   ├── Footer.tsx              # Brand footer & legal links
│   │   ├── Header.tsx              # Sticky header with logo & lang switcher
│   │   ├── HomePage.tsx            # Hero, search, filtering & listing grid
│   │   ├── LanguageSwitcher.tsx    # Sinhala/English language toggle
│   │   ├── SearchBar.tsx           # Multi-field search input
│   │   ├── TechnicianCard.tsx      # Technician summary card with badges
│   │   └── TechnicianProfile.tsx   # Detailed technician profile & actions
│   ├── lib/
│   │   ├── categories.ts           # 8 core service categories with metadata
│   │   ├── demo-data.ts            # Realistic demo records (is_demo: true)
│   │   ├── districts.ts            # 25 Sri Lankan administrative districts
│   │   ├── i18n.tsx                # Context-based translation system
│   │   ├── phone.ts                # Sri Lanka phone (+94) & WhatsApp normalization
│   │   ├── types.ts                # Shared TypeScript definitions
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser-safe Supabase client
│   │   │   └── server.ts           # Server-side Supabase client (@supabase/ssr)
│   │   └── validation/
│   │       └── technician.ts       # Server & client input validation rules
│   └── messages/
│       ├── en.json                 # English UI dictionary
│       └── si.json                 # Unicode Sinhala UI dictionary
├── supabase/
│   ├── migrations/
│   │   └── 20261025000000_init_schema.sql  # Database schema, RLS, triggers & indexes
│   └── seed.sql                    # 25 districts, categories & demo data
├── tests/
│   └── logic.test.mjs              # Automated unit tests for business logic
├── .env.example                    # Environment variable template
└── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node 25)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npx tsx tests/logic.test.mjs
```

---

## 🗄️ Database Setup (Supabase)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Run the schema migration in `supabase/migrations/20261025000000_init_schema.sql`.
4. Run the seed script in `supabase/seed.sql` to populate districts and categories.
5. Create your admin user in Supabase Authentication and insert their user ID into `public.admin_users`:
   ```sql
   insert into public.admin_users (id, email)
   values ('<YOUR_AUTH_USER_UUID>', 'admin@fixlanka.lk');
   ```

### Removing Demo Records
When you are ready to deploy real technician listings, purge demo records in one command:
```sql
delete from public.technicians where is_demo = true;
```

---

## 🔒 Security Checklist

- [x] **Row Level Security (RLS)** enabled on all database tables.
- [x] **Public Read Isolation**: Anonymous visitors can only query `published = true` technicians.
- [x] **Admin Authorization**: All insert, update, and delete actions require `is_admin()` server validation.
- [x] **No Leaked Secrets**: Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are used in client bundles.
- [x] **Input Sanitization**: Strict phone number, district, and town validation.
- [x] **Safe Phone Formatting**: Sri Lankan phone numbers normalized to E.164 (`+94`) and WhatsApp links use clean `wa.me` links without special characters.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. In Project Settings -> **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy! Vercel automatically runs `next build`.
