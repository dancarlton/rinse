# Plan: Codebase Overhaul

## Goal
Fix all broken functionality across the Rinse codebase so that the app works end-to-end: user registration, login (local + Google), browsing providers on the map, viewing provider details, and the authenticated dashboard -- all deployed to Vercel.

## Critical Issues Found

### Backend
- **User registration crashes**: Model requires `name` and `role`, but `createUserLocal` only sends `email` and `password`
- **Google OAuth crashes**: Only sends `googleId` and `email` to `User.create()`, missing required `name` and `role`
- **Double password hashing**: `pre('save')` hook hashes, then `createUserLocal` calls `hashPassword()` before `save()` -- passwords get hashed twice
- **`updateRating` method bug**: References bare `numRatings` and `rating` instead of `this.numRatings` and `this.rating`
- **No route protection**: Auth middleware exists but is never applied to any routes
- **Tests broken**: Reference `../seeds/users.js` which does not exist
- **Missing API endpoints**: No `/api/directions` endpoint (frontend tries to call it), no `/api/users/profile` endpoint
- **Outdated example.env**: Still references SendGrid and Google Maps

### Frontend
- **Map broken**: References `user.locations` (plural) but model field is `location` (singular GeoJSON)
- **Provider page brittle**: Fetches ALL users and filters by name string, not by ID
- **ServiceList hardcoded**: Real data rendering is commented out, shows hardcoded Card components
- **Card component hardcoded**: Displays static "Exterior Wash" instead of dynamic data
- **BookingPage broken**: Hardcoded Calendly URL for a specific user, broken env var `VITE_`
- **DashCalendarPage broken**: Same hardcoded Calendly URL and broken env var
- **Frontend user seed data mismatched**: Has inline services/reviews/locations that don't match DB separate-collection models
- **Wrong links**: Login "Not a member?" goes to `/`, Navbar Detailer link goes to provider page, Dashboard header links to `/app/` instead of `/dashboard/`
- **ContactForm dead**: No submit handler
- **Dead code**: `Routes.jsx` references Google Maps API, `Hero.jsx` fully commented out, `localLogin.jsx` hook unused

## Waves

**Wave 1 (parallel) -- Backend Foundation:**
- 01-fix-user-model: Fix User model defaults, updateRating bug, remove duplicate hashPassword method
- 02-fix-auth-flow: Fix registration, local login, and Google OAuth to work with corrected model
- 03-fix-backend-routes: Add missing endpoints, apply auth middleware, fix route protection
- 04-fix-backend-config: Update example.env, clean up dead imports, fix email service

**Wave 2 (parallel, after wave 1) -- Frontend Core:**
- 05-fix-frontend-api-layer: Fix RTK Query slices to match actual backend routes, remove phantom endpoints
- 06-fix-map-and-providers: Fix Map component field names, fix provider page to use ID-based lookup
- 07-fix-service-list-and-cards: Unwire hardcoded Card components, connect ServiceList to real API data
- 08-fix-auth-pages-and-nav: Fix login/register pages, navbar links, dashboard header links

**Wave 3 (parallel, after wave 2) -- Polish and Cleanup:**
- 09-fix-dashboard-pages: Connect dashboard pages to real API data, fix profile settings
- 10-fix-contact-and-booking: Add contact form submit handler, fix booking page Calendly integration
- 11-cleanup-dead-code: Remove commented-out code, unused files, fix tests seed path
- 12-fix-deployment-config: Verify Vercel config, env var documentation, seeder alignment

## Done When
- [ ] User can register with email/password (local)
- [ ] User can log in with email/password (local)
- [ ] Google OAuth login works (or gracefully skips if no credentials)
- [ ] Map page loads with provider markers from real DB data
- [ ] Provider page loads by ID with services and reviews from DB
- [ ] ServiceList shows real services from the API
- [ ] Dashboard pages load for authenticated users
- [ ] Auth middleware protects appropriate routes
- [ ] Contact form submits (sends email via Resend or shows confirmation)
- [ ] No console errors on any page during normal navigation
- [ ] `npm run build` succeeds for frontend
- [ ] Backend starts without errors locally via `doppler run -- npm run server`
