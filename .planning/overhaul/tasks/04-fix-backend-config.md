# Task: Fix Backend Config, Email Service, and Environment

**Depends on:** none
**Files:** ~4

## Context (read these first)
- `example.env` -- Root-level example env file, references outdated vars (SENDGRID_API_KEY, GOOGLE_MAPS_API_KEY)
- `frontend/example.env` -- Frontend example env file (check if it exists and is correct)
- `backend/services/emailServices.js` -- Uses Resend but has a local `resend` variable initialization issue
- `backend/server.js` -- Imports `body-parser` which is deprecated; has a stale `dotenv.config` path
- `backend/config/config.js` -- Logger init is commented out

## Objective
Clean up backend configuration: update the example.env to reflect actual environment variables used (Resend, Mapbox, Doppler-based), remove deprecated body-parser import, fix the stale dotenv config path, and ensure the email service is properly structured.

## Steps
1. In `example.env` (root level), update to reflect the actual env vars:
   - Remove: `SENDGRID_API_KEY`, `SENDING_EMAIL`, `GOOGLE_MAPS_API_KEY`, `LOGGER`
   - Add: `RESEND_API_KEY=your_resend_api_key`, `SENDING_EMAIL=onboarding@resend.dev`
   - Add: `VITE_MAPBOX_TOKEN=your_mapbox_token` (note: frontend env vars)
   - Add: `VITE_API_URL=` (empty for dev proxy, set for production)
   - Update `PORT=5050` (was 5000, should match the project convention)
   - Update `GOOGLE_CALLBACK_URL=http://localhost:5050/api/auth/google/callback`
   - Add: `VERCEL=` (set to 1 on Vercel, empty locally)

2. In `backend/server.js`:
   - Remove the `import bodyParser from 'body-parser'` and the `app.use(bodyParser.urlencoded({ extended: false }))` line
   - Replace with `app.use(express.urlencoded({ extended: false }))` (express has this built-in)
   - Remove the stale `dotenv.config({ path: './config/config.env' })` line on line 16 -- `dotenv/config` is already imported at the top (line 1) which auto-loads `.env`. With Doppler, neither is needed, but the top-level import is the safer one to keep.
   - Remove the second `import dotenv from 'dotenv'` on line 8 since `dotenv/config` on line 1 already handles it

3. In `backend/services/emailServices.js`:
   - The file is functional but ensure the lazy initialization pattern is correct. The current `getResend()` pattern is fine for serverless.
   - No structural changes needed, just verify it works.

4. In `backend/config/config.js`:
   - The commented-out `initLogger()` call is fine to leave as-is since winston logger is imported directly where needed. Remove the comment to reduce noise:
     ```javascript
     // import { initLogger } from "./logging.js";
     ```
     becomes just removing that line.

## Must-Haves
- [ ] `example.env` reflects actual environment variables (Resend, Mapbox, port 5050)
- [ ] No `body-parser` import in `server.js`
- [ ] No duplicate `dotenv` import in `server.js`
- [ ] `express.urlencoded({ extended: false })` is used instead of `bodyParser.urlencoded`

## Must-Nots
- Do not change the CORS configuration
- Do not change the MongoDB connection logic
- Do not change the passport initialization order
- Do not modify any frontend files
- Do not remove the `dotenv/config` import at the top of server.js (it's needed for non-Doppler environments)

## Verify
```bash
# Check server.js has no body-parser reference
grep -n "body-parser\|bodyParser" backend/server.js

# Check example.env has correct vars
grep -n "RESEND\|MAPBOX\|5050\|SENDGRID\|GOOGLE_MAPS" example.env

# Check server starts
doppler run -- timeout 5 node backend/server.js || true
```
