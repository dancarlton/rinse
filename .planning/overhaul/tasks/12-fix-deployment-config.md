# Task: Fix Deployment Config and Seeder Alignment

**Depends on:** 01-fix-user-model, 04-fix-backend-config
**Files:** ~4

## Context (read these first)
- `vercel.json` -- Vercel deployment config. Has rewrites: `/api/(.*)` -> `/api` (sends all API requests to `api/index.js`) and `/((?!api/).*)` -> `/index.html` (SPA fallback). This pattern works for Vercel serverless functions.
- `api/index.js` -- Vercel serverless entry point. Imports `app` from `../backend/server.js` and exports it as default. This is the correct pattern for Express on Vercel.
- `backend/server.js` -- Express app. Has `if (process.env.VERCEL !== '1')` guard around `app.listen()` to prevent listening in serverless. Uses top-level `await` for `initConfig(app)`. This works in Node 18+ ESM.
- `backend/seeder.js` -- Seeds the database. After task 01, the User model no longer requires `name` and `role`, but the seeder still provides them (which is fine). However, verify the seeder still works with the updated model.
- `backend/config/rateLimit.js` -- Disables rate limiter when `VERCEL === '1'` (correct for serverless).
- `backend/config/db.js` -- Uses `global._mongooseCache` for serverless connection reuse (correct).
- `backend/config/cors.js` -- CORS config. Needs to include the production Vercel URL.
- `package.json` -- Root package.json with build/deploy scripts.
- `frontend/vite.config.js` -- Vite config with proxy to `localhost:${PORT || 5050}`. The proxy `configure` block has a misstructured config (it's a sibling to `/api` instead of nested).

## Objective
Ensure the Vercel deployment works correctly: verify the serverless function entry point, CORS configuration includes production URLs, the Vite proxy config is correct for local development, and the seeder works with the updated models.

## Steps
1. In `frontend/vite.config.js`:
   - Fix the proxy configuration. Currently the `configure` function is a sibling to the `/api` key, which means it won't work. The structure should be:
     ```javascript
     server: {
       proxy: {
         '/api': {
           target: `http://localhost:${process.env.PORT || 5050}`,
           changeOrigin: true,
         },
       },
     },
     ```
   - The current format `'/api': \`http://localhost:...\`` is a shorthand that Vite supports, but the `configure` key next to it is invalid. Either use the full object form (with `target`) or remove the `configure` block. The `configure` block was just for debug logging and isn't needed.
   - Remove the `configure` proxy logging block (lines 13-22) -- it's debug code and isn't structured correctly anyway

2. In `backend/config/cors.js`:
   - Verify the CORS origins list includes:
     - `http://localhost:5173` (local frontend dev -- already there)
     - `process.env.CLIENT_URL` (already there -- this should be set to `https://rinse-it.vercel.app` in production Doppler config)
     - The `process.env.HOST` entries are for the API host, not the client -- these may cause CORS issues if HOST is set to the API domain. Consider whether these are needed. For safety, keep them but ensure `CLIENT_URL` is the primary origin.
   - No changes needed if `CLIENT_URL` is set correctly in Doppler. Just verify the existing config is sound.

3. In `backend/seeder.js`:
   - Verify compatibility with the updated User model (after task 01):
     - The seeder creates users with `name`, `email`, `password`, `role` -- all still valid fields
     - `name` and `role` now have defaults but the seeder provides explicit values, which is fine
   - The seeder uses `User.insertMany(users)` which bypasses the `pre('save')` hook -- this means passwords won't be hashed. The seeder creates users with `faker.internet.password()` which generates plaintext passwords, and `insertMany` won't trigger the pre-save hook.
   - Fix: Change the admin user creation to hash the password, and for bulk users, either:
     - Option A: Use `bcrypt.hashSync()` inline in the seeder for each user's password
     - Option B: Save users individually with `user.save()` (slower but triggers hooks)
     - Option A is better for performance. Import bcrypt and hash passwords before inserting:
       ```javascript
       import bcrypt from 'bcryptjs';
       // ... in the user creation loop:
       password: bcrypt.hashSync(faker.internet.password({ length: 10 }), 10),
       ```
     - Also hash the admin password: the admin template already uses `'Pa55word!'` as plaintext. Change to `bcrypt.hashSync('Pa55word!', 10)`.
   - Add `process.exit()` to the `destroyData` function's finally block (it currently only exits via `createDummyData`'s finally block, but `destroyData` can be called standalone via `-D` flag and doesn't exit)

4. In `api/index.js`:
   - Verify the import path `../backend/server.js` is correct relative to the `api/` directory. It is.
   - No changes needed.

5. Verify `vercel.json` rewrite rules:
   - `{ "source": "/api/(.*)", "destination": "/api" }` -- routes all `/api/*` requests to the serverless function at `api/index.js`. Correct.
   - `{ "source": "/((?!api/).*)", "destination": "/index.html" }` -- SPA fallback for non-API routes. Correct.
   - No changes needed.

## Must-Haves
- [ ] Vite proxy config correctly proxies `/api` to the backend port without broken `configure` block
- [ ] CORS allows `http://localhost:5173` and the production `CLIENT_URL`
- [ ] Seeder hashes passwords with bcrypt before `insertMany` (since `insertMany` skips pre-save hooks)
- [ ] `destroyData` function exits the process when called standalone (`-D` flag)
- [ ] `vercel.json` rewrite rules are correct (no changes needed, just verified)
- [ ] `api/index.js` correctly exports the Express app

## Must-Nots
- Do not change the Vercel rewrite rules unless they're broken
- Do not modify the serverless function structure (`api/index.js`)
- Do not change the MongoDB connection caching logic
- Do not remove the rate limiter Vercel guard
- Do not modify frontend source files (except `vite.config.js`)

## Verify
```bash
# Check vite proxy config
grep -A5 "proxy" frontend/vite.config.js

# Check no 'configure' block in vite config
grep -n "configure" frontend/vite.config.js  # should find nothing

# Check seeder uses bcrypt
grep -n "bcrypt\|hashSync" backend/seeder.js

# Check CORS config
grep -n "localhost:5173\|CLIENT_URL" backend/config/cors.js

# Check vercel.json
cat vercel.json

# Check api/index.js
cat api/index.js

# Test seeder runs (dry run -- just check it starts)
doppler run -- timeout 10 node backend/seeder.js 2>&1 | head -5 || true
```
