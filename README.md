# Restaugenda

A SaaS web application for restaurants and bars to track product profitability.

## Tech Stack

- **Next.js** (App Router) with TypeScript
- **Supabase** (PostgreSQL database + Auth + Row Level Security)
- **Tailwind CSS** for styling

## Features

- 🔐 **Authentication** — Email/password sign up and sign in with Supabase Auth
- 📦 **Product Management** — Track products with cost price, selling price, profit, and margin
- 📊 **Margin Highlighting** — Green (>70%), Yellow (30-70%), Red (<30%)
- 💰 **Sales Tracking** — Log daily sales and view total revenue and profit
- 📈 **Dashboard** — Overview of key metrics
- 🏠 **Landing Page** — Marketing page with feature highlights
- 💳 **Pricing Page** — Free trial + monthly/yearly plans

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/RobbeG-immalle/Restaugenda.git
cd Restaugenda
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Navigate to **Settings > API** and copy your **Project URL** and **anon/public** key.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the database migration

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Project Structure

```
app/
├── page.tsx              # Landing page
├── pricing/page.tsx      # Pricing page
├── login/page.tsx        # Login page
├── signup/page.tsx       # Sign up page
├── dashboard/
│   ├── page.tsx          # Dashboard overview
│   ├── layout.tsx        # Dashboard layout with sidebar
│   ├── products/page.tsx # Products management
│   └── sales/page.tsx    # Sales tracking
└── api/
    ├── products/route.ts         # GET, POST products
    ├── products/[id]/route.ts    # PUT, DELETE product
    ├── sales/route.ts            # GET, POST sales
    └── dashboard/route.ts        # GET dashboard stats

components/
├── Sidebar.tsx           # Dashboard navigation sidebar
├── MarginBadge.tsx       # Color-coded margin indicator
├── ProductForm.tsx       # Create/edit product form modal
├── ProductsClient.tsx    # Products table with CRUD actions
└── SalesClient.tsx       # Sales table with log form

lib/
├── supabase/
│   ├── client.ts         # Browser Supabase client
│   ├── server.ts         # Server-side Supabase client
│   └── middleware.ts     # Auth middleware helper
└── utils.ts              # calculateProfit, calculateMargin helpers

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema with RLS
```

## Pricing

- **Free Trial**: 1 month free, no credit card required
- **Monthly**: €24.99/month
- **Yearly**: €250/year (~17% savings vs monthly)
