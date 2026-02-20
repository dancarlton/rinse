# Deployment Readiness Analysis

**Project**: rinse (Car Wash Booking App - MERN Stack)
**Date**: 2026-02-20
**Verdict**: Not ready for production deployment

---

## Blockers (Must Fix Before Deploy)

### 1. Broken Route Paths
**File**: `backend/routes/index.js` (lines 12-14)

Three route registrations are missing the leading `/`:
```js
app.use('api/bookings', bookingRoutes);   // should be '/api/bookings'
app.use('api/services', serviceRoutes);   // should be '/api/services'
app.use('api/reviews', reviewRoutes);     // should be '/api/reviews'
```
Bookings, services, and reviews APIs will never match incoming requests.

### 2. No Payment System Implemented
README promises Stripe integration, but:
- No Stripe dependency in package.json
- No payment processing code anywhere
- Billing page (`DashBillingPage.jsx`) displays hardcoded mock data
- Booking model has `paymentDetails` field but nothing writes to it

### 3. No Deployment Configuration
- No `Dockerfile` (despite `@flydotio/dockerfile` in devDependencies)
- No `docker-compose.yml`, `fly.toml`, `Procfile`, or `vercel.json`
- No CI/CD pipeline (`.github/workflows/`)
- No defined way to deploy to any platform

### 4. No Production Environment Variable Management
- Only an `example.env` file exists
- Server references `./config/config.env` which is not in the repo
- No documentation for setting up production secrets

---

## Moderate Issues

| Issue | Location | Detail |
|-------|----------|--------|
| Mass assignment vulnerability | `bookingController.js:38` | `findByIdAndUpdate(id, req.body)` — attacker could overwrite `hasPaid`, `status`, etc. |
| No input validation | Booking/Service/Review controllers | Only user registration has Joi validation |
| Session expiry bug | `server.js:24` | `expiryDate` computed once at startup — all sessions share same absolute expiry |
| Sensitive data in logs | `server.js:47` | Morgan custom token logs `req.body` as JSON (passwords, tokens) |
| `bcryptjs` in frontend | `frontend/package.json` | Hashing library in client bundle — unused dead weight or security concern |
| Redundant logging libs | `package.json` | Both pino/pino-http AND winston installed |
| Redundant date libs | Both package.json files | Both moment and dayjs used |
| Rate limit too aggressive | `rateLimit.js` | 20 req/min globally will block normal page loads |
| Deprecated Mongoose options | `db.js:11-12` | `useNewUrlParser`/`useUnifiedTopology` are no-ops in Mongoose 7+ |
| ~15 open TODOs in source | Various files | Unfinished validation, error handling, refactoring |

---

## What's in Good Shape

- **Security basics**: Helmet, CORS, rate limiting, mongo-sanitize, bcrypt, JWT
- **Architecture**: Clean MVC pattern, config separated from logic
- **Auth**: Passport.js with local + Google OAuth, MongoDB session storage
- **Frontend**: React 18 + Vite + Tailwind/DaisyUI + Redux Toolkit
- **Error handling**: express-async-errors + centralized error middleware
- **Tests**: Backend user API tests exist (though minimal coverage)
- **Production serving**: Server correctly serves built frontend in prod mode

---

## Steps to Reach Deployable State

### Minimum for Demo
1. Fix the 3 broken routes (add leading `/`)
2. Generate Dockerfile using `@flydotio/dockerfile`
3. Fix session expiry bug (use `maxAge` instead of `expires`)
4. Set up production env var documentation

### Minimum for Production
5. Add input validation to booking/service/review controllers
6. Fix mass assignment vulnerability in booking updates
7. Remove request body from Morgan logging
8. Implement payment processing or remove billing UI
9. Add CI/CD pipeline (lint + test + build)
10. Add health check endpoint (exists at `/healthcheck` - good)
11. Clean up redundant dependencies (moment vs dayjs, pino vs winston)
12. Address open TODOs or convert to GitHub issues
