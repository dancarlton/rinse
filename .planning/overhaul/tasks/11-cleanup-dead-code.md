# Task: Clean Up Dead Code and Fix Tests

**Depends on:** 01-fix-user-model, 02-fix-auth-flow, 06-fix-map-and-providers
**Files:** ~7

## Context (read these first)
- `frontend/src/components/Hero.jsx` -- Entirely commented out, unused anywhere
- `frontend/src/components/Map/Routes.jsx` -- References `google.maps.TravelMode.DRIVING` (Google Maps API), which is dead code from before the Mapbox migration. Not imported or used by any component after the Map was rewritten to use Mapbox + `useDirections.jsx`.
- `frontend/src/hooks/localLogin.jsx` -- Axios-based login hook. Unused; the app uses RTK Query `useLocalLoginMutation` from `usersSlice.js` instead.
- `frontend/src/data/users.js` -- Frontend seed data with inline `services`, `reviews`, `locations` fields that don't match the actual DB model structure (DB uses separate collections). Used nowhere in the running app (only was used for development). Has `bcryptjs` import which shouldn't be in frontend code.
- `frontend/src/layouts/dashboard/SidebarSubmenu.jsx` -- Need to verify if this file exists and is functional (it's imported by `LeftSidebar.jsx`)
- `backend/tests/userApi.test.js` -- References `../seeds/users.js` which doesn't exist. The tests will fail with a module-not-found error.
- `backend/controllers/authController.js` -- Has ~200 lines of commented-out code (old password reset, verification, logout implementations)
- `backend/controllers/userController.js` -- Has commented-out verification email flow in `createUserLocal`

## Objective
Remove dead code files, fix broken test imports, and clean up large commented-out code blocks. This reduces confusion for future developers and prevents broken imports.

## Steps
1. Delete `frontend/src/components/Hero.jsx`:
   - The file is entirely commented out and not imported anywhere
   - Verify no imports reference it: `grep -rn "Hero" frontend/src/`

2. Delete `frontend/src/components/Map/Routes.jsx`:
   - References `google.maps.TravelMode` which doesn't exist (no Google Maps SDK loaded)
   - The Map component (`frontend/src/components/Map/index.jsx`) does not import it -- it uses `useDirections.jsx` hook instead
   - Verify no imports reference it: `grep -rn "Routes" frontend/src/components/Map/`

3. Delete `frontend/src/hooks/localLogin.jsx`:
   - Uses raw `axios` to call `/api/auth/login/local`
   - Not imported anywhere -- the app uses RTK Query `useLocalLoginMutation` instead
   - Verify no imports reference it: `grep -rn "localLogin" frontend/src/` (should only show the RTK Query mutation usage, not this file)

4. Clean up `frontend/src/data/users.js`:
   - This file imports `bcryptjs` in the frontend, which is a server-side library
   - The data structure doesn't match the actual DB models
   - Check if it's imported anywhere: `grep -rn "data/users" frontend/src/`
   - If not imported anywhere in the running app, delete it
   - If imported somewhere, update it to remove `bcryptjs` and align with the actual model structure

5. Fix `backend/tests/userApi.test.js`:
   - Line 5: `import sampleUsers from '../seeds/users.js'` -- this file doesn't exist
   - Create `backend/seeds/users.js` with proper test seed data that matches the User model (after task 01 fixes). The seed data needs `email` and `password` at minimum (name and role now have defaults):
     ```javascript
     const sampleUsers = [
       {
         name: 'admin',
         email: 'admin@email.com',
         password: '$2a$10$...',  // pre-hashed 'Pa55word!'
         role: 'admin',
       },
       {
         name: 'testuser',
         email: 'user@email.com',
         password: '$2a$10$...',  // pre-hashed 'Pa55word!'
         role: 'user',
       },
     ];
     export default sampleUsers;
     ```
   - Use `bcryptjs` to generate proper hashed passwords for the seed data, or use `bcrypt.hashSync('Pa55word!', 10)` inline
   - Note: The test file uses `import` syntax (ESM) so the seed file must use `export default`

6. Clean up `backend/controllers/authController.js`:
   - Remove the ~150 lines of commented-out code (lines 103-320): the old `postLoginForgot`, `postLoginReset`, `postLogout`, `postVerify`, `getConfirmation` implementations
   - Keep only the active exports: `logoutUser`, `localLogin`, `googleLogin`, `googleCallback`
   - Remove unused imports at the top: `validateEmail`, `validatePassword` (only used in commented-out code), `TokenService`, `EmailService`, `dayjs`
   - Keep only imports actually used by the active functions: `sanitize`, `passport`, `validateLoginInput`, `UserService` (check if UserService is used -- it's not in any active function, so remove it too), `logger`

7. Clean up `backend/controllers/userController.js`:
   - Remove the commented-out verification email flow in `createUserLocal` (lines 107-143)
   - Keep the active code that creates the user and returns 201

## Must-Haves
- [ ] `Hero.jsx` deleted
- [ ] `Map/Routes.jsx` deleted
- [ ] `hooks/localLogin.jsx` deleted
- [ ] `data/users.js` deleted (if unused) or cleaned up (if used)
- [ ] `backend/seeds/users.js` exists with valid seed data matching the User model
- [ ] `backend/tests/userApi.test.js` can resolve its import of `../seeds/users.js`
- [ ] No commented-out function bodies remain in `authController.js` (small inline comments are fine)
- [ ] No unused imports in `authController.js`

## Must-Nots
- Do not modify any active (non-commented) controller logic
- Do not delete the test file itself (`userApi.test.js`)
- Do not modify the User model or any other model
- Do not remove the `backend/tests/teardown.js` file
- Do not change the route definitions
- Do not delete `frontend/src/components/Map/ProviderMarker.jsx` or `RouteDetails.jsx` (these ARE used)

## Verify
```bash
# Verify deleted files don't exist
test ! -f frontend/src/components/Hero.jsx && echo "Hero.jsx deleted"
test ! -f frontend/src/components/Map/Routes.jsx && echo "Routes.jsx deleted"
test ! -f frontend/src/hooks/localLogin.jsx && echo "localLogin.jsx deleted"

# Verify seed file exists
test -f backend/seeds/users.js && echo "seeds/users.js exists"

# Verify no broken imports
grep -rn "Hero" frontend/src/ --include="*.jsx" --include="*.js" | grep -v node_modules | grep -v dist
grep -rn "Routes" frontend/src/components/Map/ --include="*.jsx" | grep -v node_modules
grep -rn "localLogin" frontend/src/hooks/ 2>/dev/null  # should find nothing

# Verify authController is clean
wc -l backend/controllers/authController.js  # should be much shorter than before (~50-70 lines vs ~320)

# Check no bcryptjs in frontend (except node_modules)
grep -rn "bcryptjs" frontend/src/ --include="*.js" --include="*.jsx"

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
