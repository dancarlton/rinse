# Task: Fix Auth Pages and Navigation Links

**Depends on:** 05-fix-frontend-api-layer, 06-fix-map-and-providers
**Files:** ~4

## Context (read these first)
- `frontend/src/pages/LoginPage.jsx` -- Login page. "Not a member?" link on line 155 points to `/` instead of `/register`. Also, the Google login button has `type='submit'` which causes form submission before the `window.open` call.
- `frontend/src/pages/RegisterPage.jsx` -- Register page. Google login button also has `type='submit'`. The registration response stores `{ newUser }` (nested) in credentials via `dispatch(setCredentials({ ...res }))` but the backend returns `{ newUser: {...} }` -- so `userInfo` in Redux ends up as `{ newUser: {...} }` instead of the user object itself.
- `frontend/src/components/Navbar.jsx` -- Navigation bar. The desktop "Register > Detailer" dropdown link on line 123 points to `/provider/Emily%20Davis` instead of a registration page. The "Generic Provider Page" link on line 152 uses a hardcoded name `John%20Smith` which won't work now that routes use `:id`. Several NavLink paths need updating.
- `frontend/src/main.jsx` -- Router definition. After task 06, provider routes use `:id` instead of `:name`. Confirm this is done.
- `frontend/src/slices/authSlice.js` -- Auth slice that stores `userInfo` in Redux and localStorage.

## Objective
Fix broken links and form behavior across the login page, register page, and navbar so that: (1) the "Not a member?" link goes to `/register`; (2) Google login buttons don't trigger form submission; (3) registration correctly stores the user object in Redux (not a nested `{ newUser }` wrapper); (4) navbar links point to valid routes; (5) the hardcoded provider name links are either removed or replaced with a proper discovery flow.

## Steps
1. In `frontend/src/pages/LoginPage.jsx`:
   - Line 155: Change the "Not a member?" `<Link to='/'>` to `<Link to='/register'>`
   - Line 141: Change the Google login button from `type='submit'` to `type='button'` so it doesn't trigger form submission
   - Line 131: Change the local login button from `type='submit'` to `type='button'` as well (the `onClick` handler already calls `handleLocalLogin` which does `e.preventDefault()`, but using `type='button'` is cleaner)

2. In `frontend/src/pages/RegisterPage.jsx`:
   - Line 180: Change the Google register button from `type='submit'` to `type='button'`
   - Line 170: Change the local register button from `type='submit'` to `type='button'`
   - Lines 50-52: Fix the registration response handling. The backend returns `{ newUser: {...} }`. Currently the code does:
     ```javascript
     const res = await register({ email, password }).unwrap();
     dispatch(setCredentials({ ...res }));
     ```
     This stores `{ newUser: { _id, email, ... } }` in Redux. Change to:
     ```javascript
     const res = await register({ email, password }).unwrap();
     dispatch(setCredentials(res.newUser));
     ```
   - Remove the `console.log(res)` on line 51

3. In `frontend/src/components/Navbar.jsx`:
   - Line 123: Change the desktop "Register > Detailer" `<NavLink to='/provider/Emily%20Davis'>` to `<NavLink to='/register'>` (or to a dedicated provider registration page if one exists -- it doesn't, so just use `/register`)
   - Lines 98 and 152: The "Generic Provider Page" links use `/provider/John%20Smith`. Since routes now use `:id`, these hardcoded name-based links will break. Either:
     - Remove these "Generic Provider Page" links entirely (they were for development/demo purposes)
     - Or change them to link to `/map` where users can discover providers
   - Recommended: Remove the "Generic Provider Page" `<li>` entries from both mobile (line 96-99) and desktop (line 150-153) menus. They were dev-only links.

4. In `frontend/src/layouts/RootLayout.jsx`:
   - No changes needed, but verify it works correctly. The `useGetCurrentUserQuery` call fetches the current session user on page load, which is correct for maintaining auth state after Google OAuth redirects.

## Must-Haves
- [ ] "Not a member?" link on LoginPage goes to `/register`
- [ ] All Google login/register buttons have `type='button'` not `type='submit'`
- [ ] Registration stores the actual user object in Redux, not `{ newUser: {...} }`
- [ ] No hardcoded provider name links (`John%20Smith`, `Emily%20Davis`) in Navbar
- [ ] No `console.log` statements in registration flow

## Must-Nots
- Do not modify the auth slice logic (setCredentials, logout)
- Do not change the RTK Query mutations (localLogin, localRegister, logout)
- Do not modify backend files
- Do not remove the `/map` or `/contact` navigation links
- Do not change the dashboard link behavior

## Verify
```bash
# Check LoginPage link
grep -n "Not a member\|to='/register'\|to='/'" frontend/src/pages/LoginPage.jsx

# Check no type='submit' on Google buttons
grep -n "type='submit'" frontend/src/pages/LoginPage.jsx
grep -n "type='submit'" frontend/src/pages/RegisterPage.jsx

# Check no hardcoded provider names in Navbar
grep -n "John%20Smith\|Emily%20Davis" frontend/src/components/Navbar.jsx

# Check registration stores user correctly
grep -n "setCredentials" frontend/src/pages/RegisterPage.jsx

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
