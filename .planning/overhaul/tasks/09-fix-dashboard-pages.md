# Task: Fix Dashboard Pages

**Depends on:** 05-fix-frontend-api-layer, 08-fix-auth-pages-and-nav
**Files:** ~5

## Context (read these first)
- `frontend/src/pages/protected/DashProfileSettingsPage.jsx` -- Profile settings page. Uses hardcoded placeholder data ("Alex", "alex@dashwind.com", "UI/UX Designer", "California", "IST"). The "Update" button dispatches a notification but does not actually call the API. Should use the `profile` RTK Query mutation from `usersSlice.js` and populate fields from the logged-in user.
- `frontend/src/pages/protected/DashTransactionsPage.jsx` -- Transactions page. Uses `RECENT_TRANSACTIONS` from `dummyData.js` which is entirely hardcoded placeholder data with fake names and cities. Should fetch real booking data from the API.
- `frontend/src/pages/protected/DashTeamsPage.jsx` -- Teams page. Uses hardcoded `TEAM_MEMBERS` array with fake data ("Alex", "Ereena", etc.). For now this can remain as placeholder since there's no team/organization model in the backend.
- `frontend/src/pages/protected/DashBillingPage.jsx` -- Billing page. Shows "Coming Soon" placeholder. This is fine to leave as-is.
- `frontend/src/layouts/dashboard/Header.jsx` -- Dashboard header. Profile dropdown links use `/app/settings-profile` and `/app/settings-billing` (lines 121-128) but the actual dashboard routes are at `/dashboard/settings-profile` and `/dashboard/settings-billing`. The logout function on line 42 uses `localStorage.clear()` and `window.location.href = '/'` instead of the RTK Query logout mutation.
- `frontend/src/layouts/dashboard/DashboardLayout.jsx` -- Dashboard layout wrapper. No auth check -- any user can access `/dashboard` without being logged in.
- `frontend/src/slices/usersSlice.js` -- Has `useProfileMutation` and `useGetCurrentUserQuery` hooks
- `frontend/src/slices/authSlice.js` -- Has `setCredentials` and `logout` actions
- `frontend/src/routes/dashboardRoutes.js` -- Maps dashboard sub-routes to lazy-loaded page components
- `frontend/src/routes/sidebarRoutes.jsx` -- Sidebar navigation items with paths

## Objective
Fix the dashboard so it: (1) requires authentication to access; (2) has correct internal links; (3) populates profile settings from the logged-in user's data; (4) uses the proper logout flow; (5) shows real booking data in transactions (or gracefully shows empty state).

## Steps
1. In `frontend/src/layouts/dashboard/DashboardLayout.jsx`:
   - Add an authentication check. Import `useSelector` from `react-redux` and `Navigate` from `react-router-dom`.
   - Check `useSelector(state => state.auth.userInfo)` -- if null, redirect to `/login` using `<Navigate to="/login" replace />`
   - This prevents unauthenticated users from seeing the dashboard

2. In `frontend/src/layouts/dashboard/Header.jsx`:
   - Line 121: Change `/app/settings-profile` to `/dashboard/settings-profile`
   - Line 128: Change `/app/settings-billing` to `/dashboard/settings-billing`
   - Lines 41-44: Replace the manual `logoutUser` function with the proper RTK Query logout. Import `useLogoutMutation` from `../../slices/usersSlice`, import `logout` from `../../slices/authSlice`, import `useDispatch` from `react-redux`, import `useNavigate` from `react-router-dom`. Replace:
     ```javascript
     function logoutUser() {
       localStorage.clear();
       window.location.href = '/';
     }
     ```
     with:
     ```javascript
     const [logoutApi] = useLogoutMutation();
     const navigate = useNavigate();
     const logoutUser = async () => {
       try {
         await logoutApi().unwrap();
         dispatch(logout());
         navigate('/');
       } catch (err) {
         console.error(err);
       }
     };
     ```
   - Note: `dispatch` is already available in the component (line 15).

3. In `frontend/src/pages/protected/DashProfileSettingsPage.jsx`:
   - Import `useGetCurrentUserQuery` and `useProfileMutation` from `../../slices/usersSlice`
   - Import `useSelector` from `react-redux`
   - Get the current user: `const { userInfo } = useSelector(state => state.auth)`
   - Replace hardcoded default values ("Alex", "alex@dashwind.com", etc.) with values from `userInfo`:
     - Name: `userInfo?.name || ''`
     - Email: `userInfo?.email || ''`
     - Remove or generalize the "Title", "Place", "Language", "Timezone" fields (they don't exist on the User model). Either remove them or keep them as UI placeholders with empty defaults.
   - Wire the "Update" button to call the `profile` mutation with the form data, then dispatch `showNotification` on success

4. In `frontend/src/pages/protected/DashTransactionsPage.jsx`:
   - Import `useGetCurrentUserQuery` from `../../slices/usersSlice` (or use `useSelector` for auth)
   - Ideally, fetch the user's bookings via RTK Query. Since there's no dedicated "current user bookings" endpoint yet, the component can either:
     - Option A: Show an empty state / "No transactions yet" message instead of fake data
     - Option B: If the user ID is available, use a new `useGetUserBookingsQuery(userId)` endpoint (add to usersSlice: `GET /api/users/:id/bookings`)
   - Option A is acceptable for now. Replace `RECENT_TRANSACTIONS` with an empty array default and show "No transactions found" when empty. Remove the import of `RECENT_TRANSACTIONS` from `dummyData.js`.
   - Keep the filter/search UI structure intact for when real data is available.

5. In `frontend/src/pages/protected/DashTeamsPage.jsx`:
   - This page has no backend support (no team/org model). Leave the hardcoded data but add a comment explaining it's placeholder data.
   - No functional changes needed.

## Must-Haves
- [ ] Dashboard redirects to `/login` when user is not authenticated
- [ ] Dashboard header links use `/dashboard/` prefix, not `/app/`
- [ ] Dashboard logout uses RTK Query mutation and clears Redux state properly
- [ ] Profile settings page populates from logged-in user data, not hardcoded values
- [ ] Transactions page does not show fake/dummy data (shows empty state or real bookings)
- [ ] No `localStorage.clear()` + `window.location.href` logout pattern

## Must-Nots
- Do not modify the sidebar route definitions
- Do not change the dashboard route paths in `dashboardRoutes.js`
- Do not modify the DashBillingPage (it's already a proper "Coming Soon" placeholder)
- Do not create new backend endpoints (use existing ones or show empty states)
- Do not modify backend files

## Verify
```bash
# Check dashboard layout has auth check
grep -n "userInfo\|Navigate\|useSelector\|redirect\|login" frontend/src/layouts/dashboard/DashboardLayout.jsx

# Check header links
grep -n "/app/\|/dashboard/" frontend/src/layouts/dashboard/Header.jsx

# Check header logout
grep -n "localStorage.clear\|logoutApi\|useLogoutMutation" frontend/src/layouts/dashboard/Header.jsx

# Check profile settings uses real data
grep -n "userInfo\|useSelector\|dashwind\|Alex" frontend/src/pages/protected/DashProfileSettingsPage.jsx

# Check transactions doesn't use dummy data
grep -n "RECENT_TRANSACTIONS\|dummyData" frontend/src/pages/protected/DashTransactionsPage.jsx

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
