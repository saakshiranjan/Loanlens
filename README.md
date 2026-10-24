# 🏦 LoanLens — Smart Loan Assistant

> **"See Your Loan Clearly."**  
> A modern, full-stack fintech web application designed for the Indian banking sector. LoanLens empowers borrowers to compare loans across banks and NBFCs, calculate accurate reducing-balance EMIs, analyze borrowing capacity, and identify friction points in their loan profiles before applying.

---

## 📑 Table of Contents

- [Overview & Objectives](#-overview--objectives)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Feature Showcase](#-feature-showcase)
  - [1. Reducing-Balance EMI Calculator](#1-reducing-balance-emi-calculator)
  - [2. Multi-Lender Comparison Engine](#2-multi-lender-comparison-engine)
  - [3. LoanLens Readiness Check (Rejection Predictor)](#3-loanlens-readiness-check-rejection-predictor)
  - [4. What-If Loan Simulator](#4-what-if-loan-simulator)
  - [5. Personalized User Dashboard](#5-personalized-user-dashboard)
  - [6. Protected Admin Dashboard & Offer Audit](#6-protected-admin-dashboard--offer-audit)
  - [7. Transparent Business Model & Disclaimers](#7-transparent-business-model--disclaimers)
- [Security, Privacy & Fair Lending](#-security-privacy--fair-lending)
- [Demo Credentials](#-demo-credentials)
- [Local Development & Setup Guide](#-local-development--setup-guide)
- [Switching to Production Services](#-switching-to-production-services)
  - [PostgreSQL Database](#postgresql-database)
  - [Clerk Authentication](#clerk-authentication)
- [Automated Testing](#-automated-testing)
- [License & Statutory Disclaimers](#-license--statutory-disclaimers)

---

## 🎯 Overview & Objectives

In India's retail credit ecosystem, borrowers frequently submit loan applications without knowing their actual **Fixed Obligation to Income Ratio (FOIR)** or how subtle differences in compound interest, tenure, and upfront processing fees compound into lakhs of rupees in extra borrowing costs.

**LoanLens solves this by:**
1. Providing mathematically exact reducing-balance calculations with full month-by-month amortization tables.
2. Comparing indicative offers across **Public Banks, Private Banks, NBFCs, and Co-operative Banks**.
3. Diagnosing application weaknesses before a hard credit pull occurs via transparent, rule-based scoring (0–100).
4. Ensuring strict privacy: **Zero data selling, no unsolicited telemarketing calls, and no storage of banking passwords or OTPs**.

---

## 🛠 Architecture & Tech Stack

```
loanlens/
├── prisma/
│   ├── schema.prisma           # Prisma PostgreSQL schema
│   └── seed.ts                 # Database seed script with fictional Indian lenders
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx # Email/password login with demo credential hints
│   │   │   └── sign-up/page.tsx # Registration with Zod validation & consent
│   │   ├── admin/page.tsx      # Protected administrative portal
│   │   ├── api/
│   │   │   ├── admin/          # Admin stats & lender catalog API
│   │   │   ├── auth/           # Login, registration, session me & signout
│   │   │   ├── dashboard/      # User dashboard aggregation & record deletion
│   │   │   ├── emi/            # EMI computation route
│   │   │   ├── loans/          # Multi-filter loan product catalog
│   │   │   ├── readiness/      # Rule-based readiness calculation & saving
│   │   │   └── scenarios/      # What-if scenario storage & retrieval
│   │   ├── business-model/     # Monetization ethics & non-endorsement disclosures
│   │   ├── calculator/         # Full EMI calculator with charts & amortization
│   │   ├── compare/            # Side-by-side comparison engine (up to 3 banks)
│   │   ├── dashboard/          # Authenticated user dashboard
│   │   ├── disclaimer/         # Statutory financial disclosures
│   │   ├── privacy/            # Privacy policy & DPDP Act compliance
│   │   ├── readiness/          # Interactive Loan Readiness Check
│   │   ├── simulator/          # What-if multi-scenario simulator
│   │   ├── terms/              # Terms of service
│   │   ├── layout.tsx          # Root layout with fonts, auth & toast providers
│   │   └── page.tsx            # High-conversion landing page
│   ├── components/
│   │   ├── calculator/         # EMICalculatorFull component
│   │   ├── compare/            # LoanComparison component
│   │   ├── home/               # Hero, EMI preview, How-It-Works, Categories, FAQs
│   │   ├── layout/             # Responsive Navbar & compliance-rich Footer
│   │   ├── readiness/          # ReadinessCheck component
│   │   ├── simulator/          # WhatIfSimulator component
│   │   └── ui/                 # Reusable Button, Card, Input, Toaster
│   ├── contexts/
│   │   └── AuthContext.tsx     # Client-side authentication context
│   ├── lib/
│   │   ├── auth.ts             # Cryptographic JWT session handling & RBAC
│   │   ├── finance.ts          # Core reducing-balance math & currency formatters
│   │   ├── mockStore.ts        # Built-in in-memory fallback for offline dev
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── readiness.ts        # Rule-based underwriting engine & weights
│   │   └── validations.ts      # Zod validation schemas
│   └── __tests__/              # Automated test suites (finance, readiness, auth)
```

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated Indian fintech palette (Deep Navy Blue `#020617`, `#0f172a`, Crisp Teal `#0d9488`, Emerald, and Amber accents).
- **Charts**: [Recharts](https://recharts.org/) for principal vs. interest pie charts and scenario comparison graphs.
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/).
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/).
- **Authentication**: JWT-based session management (`jose` + `bcryptjs`) with zero external service lock-in, and pre-architected hooks for [Clerk](https://clerk.com/).

---

## 🌟 Feature Showcase

### 1. Reducing-Balance EMI Calculator
- Implements standard Indian banking reducing balance equation:  
  $$\text{EMI} = \frac{P \times R \times (1 + R)^N}{(1 + R)^N - 1}$$
- Inputs for loan amount ($\text{₹}1,000$ to $\text{₹}10\text{ Cr}$), annual rate ($0\%$ to $60\%$), and tenure ($1$ to $360$ months).
- Calculates monthly EMI, aggregate interest payable, total repayment, and upfront processing fees (flat or percentage).
- Interactive Recharts pie chart showing principal vs. interest proportion.
- Comprehensive month-by-month amortization table displaying starting balance, principal component, interest component, and ending balance.

### 2. Multi-Lender Comparison Engine
- Compares offers across 5 loan categories: **Personal, Home, Education, Vehicle, and Business**.
- Select up to **3 offers side-by-side** for a detailed comparison matrix.
- Sort offers dynamically by minimum interest rate, estimated monthly EMI, or total borrowing cost.
- Clear institution badges: *Public Bank*, *Private Bank*, *NBFC*, and *Co-operative Bank*.
- Prominent disclaimers distinguishing demo/indicative rates from real offers.

### 3. LoanLens Readiness Check (Rejection Predictor)
- Analyzes 10 self-reported financial indicators: net monthly income, employment category, employment tenure, existing monthly obligations, requested loan amount, desired tenure, and credit score range.
- Rule-based transparent score ($0\text{--}100$) derived from configurable weights:
  - **Debt-To-Income (DTI)**: $25\%$
  - **New EMI Ratio**: $30\%$
  - **Credit Score Band**: $20\%$
  - **Employment Stability**: $15\%$
  - **Disposable Monthly Income**: $10\%$
- Identifies critical friction points (e.g., FOIR exceeding $50\%$, insufficient employment duration, excessive tenure).
- Generates actionable recommendations to optimize borrowing capacity before submitting formal bank applications.

### 4. What-If Loan Simulator
- Interactive comparison of 3 simultaneous scenarios:
  - **Scenario A**: Baseline / Current Plan
  - **Scenario B**: Shorter Tenure / Higher EMI
  - **Scenario C**: Higher Down Payment
- Instant calculation of disposable income changes, total interest savings, and affordability indicators.
- One-click option to save simulation scenarios directly to the user dashboard.

### 5. Personalized User Dashboard
- Aggregated financial summary: Recent EMI calculations, saved bank comparisons, historical readiness assessments, and what-if scenarios.
- Curated financial guides explaining CIBIL optimization, the 40% FOIR rule, and extra annual EMI prepayment strategies.
- **Data Sovereignty Controls**: One-click deletion of individual calculations or bulk purging of all assessment records.

### 6. Protected Admin Dashboard & Offer Audit
- Restricted to verified administrative credentials (`role: ADMIN`).
- Platform telemetry metrics: Total users, total calculations, total readiness assessments, active lenders, and catalog products.
- Lender management: Add new banking institutions, define acronyms, categories, and active statuses.
- **Offer Verification Audit**: Maintains the exact regulatory source document and last audit verification date for all listed loan products.

### 7. Transparent Business Model & Disclaimers
- Clear disclosure of monetization avenues: Free core calculators, premium financial planning, and non-exclusive ethical lender referrals.
- Full statutory disclaimer affirming that LoanLens is an independent analytics tool, not an RBI-licensed bank or credit broker.

---

## 🔒 Security, Privacy & Fair Lending

- **Zero Data Selling**: User financial inputs and contact details are never monetized or distributed to telemarketing agencies.
- **No Banking Passwords**: We never prompt for internet banking passwords, card PINs, CVVs, or SMS OTPs.
- **Server-Side Validation**: All incoming API requests are validated with strict Zod schemas.
- **Cryptographic Security**: Passwords salted with bcrypt (12 rounds) and session cookies configured with `HttpOnly`, `SameSite: Lax`, and `Secure` flags.
- **Strict Authorization**: User records are always scoped to the authenticated session ID; client-supplied IDs are never trusted for ownership authorization.

---

## 🔑 Demo Credentials

To explore the application immediately without signing up:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Standard User** | `demo@loanlens.in` | `Demo@123` | Full access to Dashboard, Calculators, Comparisons, Readiness & Simulator |
| **Administrator** | `admin@loanlens.in` | `Admin@123` | Full access plus `/admin` platform management & offer audit portal |

---

## 🚀 Local Development & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17.0+ or v20+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Quick Start (Local Mock Mode)
LoanLens includes an automatic **In-Memory Mock Fallback Engine** (`src/lib/mockStore.ts`). You can launch and test all features without needing a local PostgreSQL instance running:

```bash
# 1. Clone repository & navigate to directory
cd loanlens

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. All pages, API routes, calculation engines, and mock authentication will function immediately!

---

## 🔄 Switching to Production Services

### PostgreSQL Database
To connect a live PostgreSQL database:

1. Update `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/loanlens?schema=public"
   ```
2. Update the datasource provider in `prisma/schema.prisma` if not already set:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Push schema migrations and seed demo data:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### Clerk Authentication
To transition from local mock authentication to Clerk:

1. Sign up at [Clerk.com](https://clerk.com/) and create an application.
2. Add your Clerk API keys to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   NEXT_PUBLIC_USE_MOCK_AUTH=false
   ```
3. Wrap your root layout with `<ClerkProvider>` and mount `<SignIn />` / `<SignUp />` components.

---

## 🧪 Automated Testing

LoanLens includes comprehensive unit and integration test suites:

```bash
# Run automated tests
npm test
```

### Test Coverage Highlights:
- **`src/__tests__/finance.test.ts`**: Verifies reducing-balance EMI mathematical accuracy against known banking benchmarks, zero-interest schemes, boundary conditions, processing fees, amortization schedules, and Indian currency formatting (`formatINR`).
- **`src/__tests__/readiness.test.ts`**: Verifies DTI calculation, FOIR threshold trigger points ($>50\%$), score bounding ($0\text{--}100$), weakness identification, and educational disclaimer presence.
- **`src/__tests__/auth.test.ts`**: Verifies cryptographic JWT creation, token validation, tampering rejection, and administrative role segregation.

---

## ⚖️ License & Statutory Disclaimers

- **Educational Purpose**: LoanLens is an analytical and educational decision-support platform. It does not provide official credit sanctions, underwriting warranties, or formal loan approvals.
- **Non-Endorsement**: Listed banks (such as Bharat State Bank, IndiaFirst Finance Bank, etc.) are fictional demo profiles or referenced for comparative purposes only and do not endorse LoanLens.
- **License**: MIT License. See [LICENSE](LICENSE) for details.
