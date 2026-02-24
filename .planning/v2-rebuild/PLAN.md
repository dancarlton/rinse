# Rinse v2 — Full Rebuild Plan

## Status
- [x] Pre-build: Update README on main (committed)
- [x] Orphan branch `rinse-v2` created (clean slate, no old code)
- [x] Wave 1: Foundation
- [x] Wave 2: Provider Side
- [x] Wave 3: Customer Discovery
- [x] Wave 4: Booking & Payments
- [x] Wave 5: Dashboards
- [x] Wave 6: Polish & Deploy

## Current State
- All 6 waves complete — 102 files, 26 routes, build passes
- On branch `rinse-v2` — NOT YET COMMITTED
- Next: commit all files, then merge to main and deploy

---

## Stack
| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | Supabase Postgres + PostGIS |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Payments | Stripe Connect (providers get paid, platform takes 15%) |
| Maps | Mapbox GL JS (react-map-gl) + PostGIS geospatial queries |
| Real-time | Supabase Realtime (booking status updates) |
| Email | Resend (booking confirmations) |
| Styling | Tailwind CSS + shadcn/ui (dark theme, gold accents) |
| Hosting | Vercel |
| Secrets | Doppler (dev/prd) |

## Database Schema (Postgres + PostGIS)

**Tables:**
- `profiles` — extends auth.users (name, avatar_url, role customer/provider, bio, phone, location geography(Point,4326), address, rating, num_ratings, stripe_account_id, stripe_onboarding_complete)
- `services` — provider's offerings (provider_id FK, title, description, price, duration_minutes, photo_url, is_active)
- `availability` — weekly schedule (provider_id FK, day_of_week 0-6, start_time, end_time)
- `bookings` — core entity (provider_id FK, customer_id FK, service_id FK, scheduled_at, location geography, address, status enum, payment_intent_id, amount, platform_fee)
- `reviews` — per booking (booking_id FK unique, provider_id FK, customer_id FK, rating 1-5, comment, reply)

**Key DB features:**
- RLS on all tables
- PostGIS `find_nearby_providers(lat, lng, radius)` function using `ST_DWithin`
- Trigger: `on_review_created` auto-updates provider rating
- GIST index on location columns

---

## Wave 1: Foundation
Create orphan branch, scaffold Next.js, set up Supabase, auth, dark theme, landing page.

| Task | What | Key Files |
|------|------|-----------|
| 1.1 | Orphan branch + Next.js init + project structure | `next.config.ts`, `package.json`, dir structure |
| 1.2 | Tailwind + shadcn/ui dark premium theme | `tailwind.config.ts`, `app/globals.css`, `components/ui/*` |
| 1.3 | Supabase setup + full schema migration | `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`, `types/database.ts`, `supabase/migrations/001_schema.sql` |
| 1.4 | Auth pages (login, register, Google OAuth) | `app/login/page.tsx`, `app/register/page.tsx`, `app/auth/callback/route.ts`, `app/actions/auth.ts` |
| 1.5 | Layout + navbar + landing page | `app/layout.tsx`, `app/page.tsx`, `components/navbar.tsx`, `components/footer.tsx` |

**Parallelism:** 1.1 first, then 1.2+1.3 parallel, then 1.4+1.5 parallel.

## Wave 2: Provider Side
Provider onboarding, service CRUD, availability, public profile.

| Task | What | Key Files |
|------|------|-----------|
| 2.1 | Provider onboarding flow (profile, location) | `app/onboarding/page.tsx`, `app/actions/profile.ts` |
| 2.2 | Service management CRUD | `app/dashboard/provider/services/*`, `app/actions/services.ts` |
| 2.3 | Availability weekly schedule | `app/dashboard/provider/availability/page.tsx`, `app/actions/availability.ts` |
| 2.4 | Provider public profile page | `app/provider/[id]/page.tsx` |

**Parallelism:** 2.1 first, then 2.2+2.3 parallel, then 2.4.

## Wave 3: Customer Discovery
Map search, geospatial queries, provider list, detail page.

| Task | What | Key Files |
|------|------|-----------|
| 3.1 | Map page with Mapbox GL JS | `app/search/page.tsx`, `components/map/*` |
| 3.2 | Geospatial search API (PostGIS) | `app/api/providers/nearby/route.ts` |
| 3.3 | Provider list/grid alongside map | `components/providers/provider-list.tsx`, `components/providers/provider-card.tsx` |
| 3.4 | Provider detail + service selection | enhance `app/provider/[id]/page.tsx` |

**Parallelism:** 3.1+3.2 parallel, then 3.3+3.4 parallel.

## Wave 4: Booking & Payments
Stripe Connect, booking wizard, payment processing, email confirmations.

| Task | What | Key Files |
|------|------|-----------|
| 4.1 | Stripe Connect onboarding for providers | `lib/stripe/config.ts`, `app/api/stripe/connect/*`, `app/dashboard/provider/stripe/page.tsx` |
| 4.2 | Booking flow (service → datetime → location → checkout) | `app/booking/[providerId]/page.tsx`, `components/booking/*`, `app/actions/bookings.ts` |
| 4.3 | Booking confirmation + email (Resend) | `lib/resend/*`, `app/booking/[providerId]/success/page.tsx` |
| 4.4 | Booking status management (provider actions) | `app/dashboard/provider/bookings/page.tsx`, extend `app/actions/bookings.ts` |

**Parallelism:** 4.1 first, then 4.2, then 4.3+4.4 parallel.

## Wave 5: Dashboards
Provider + customer dashboards, real-time updates, profile settings, reviews.

| Task | What | Key Files |
|------|------|-----------|
| 5.1 | Provider dashboard (bookings, earnings, reviews) | `app/dashboard/provider/page.tsx`, `components/provider/*` |
| 5.2 | Customer dashboard (bookings, leave reviews) | `app/dashboard/customer/page.tsx`, `components/customer/*` |
| 5.3 | Profile settings (edit profile, change password) | `app/dashboard/settings/page.tsx` |
| 5.4 | Real-time booking updates (Supabase Realtime) | `hooks/useRealtimeBookings.ts` |

**Parallelism:** 5.1+5.2+5.3 parallel, then 5.4.

## Wave 6: Polish & Deploy
Responsive design, loading states, SEO, Vercel deploy, seed data.

| Task | What | Key Files |
|------|------|-----------|
| 6.1 | Responsive design + mobile optimization | Touch all pages |
| 6.2 | Loading skeletons, error boundaries, toasts | `app/error.tsx`, `app/loading.tsx` per route |
| 6.3 | SEO + metadata + OG images | `app/sitemap.ts`, metadata in layouts |
| 6.4 | Vercel deployment + Doppler integration | `vercel.json`, Doppler prd config |
| 6.5 | Seed script for demo data | `scripts/seed.ts` |

**Parallelism:** 6.1+6.2+6.3 parallel, then 6.4+6.5 parallel.

---

## Verification

After each wave:
- `npm run build` passes
- `npm run dev` — manual smoke test of new features
- No console errors

## Design Direction
- Dark premium theme (near-black backgrounds)
- Gold accent color (#D4AF37 or similar)
- Clean, modern typography
- shadcn/ui components customized for dark theme

## Merge Strategy
1. `git checkout main && git branch main-v1-backup`
2. Merge rinse-v2 into main (replaces everything)
3. Update Vercel env vars, verify production
4. Delete backup branch after verification
