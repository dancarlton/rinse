# Task: Fix Frontend API Layer (RTK Query Slices)

**Depends on:** 03-fix-backend-routes
**Files:** ~3

## Context (read these first)
- `frontend/src/slices/apiSlice.js` -- Base RTK Query API slice
- `frontend/src/slices/usersSlice.js` -- User-related API endpoints (login, register, CRUD)
- `frontend/src/slices/navSlice.js` -- Navigation slice with an injected `/api/directions` endpoint
- `frontend/src/constants.js` -- API URL constants
- `frontend/src/store.js` -- Redux store configuration
- `backend/routes/userRoutes.js` -- Backend user routes (after task 03 fixes)

## Objective
Fix the RTK Query slices so they match the actual backend API routes. Currently: (1) `usersSlice` has a `profile` mutation pointing to `PUT /api/users/profile` which now exists after task 03; (2) `navSlice` injects a `getTravelTimeInformation` query pointing to `POST /api/directions` which doesn't exist on the backend -- the frontend already uses client-side Mapbox Directions API in `useDirections.jsx` so this endpoint injection should be removed; (3) add missing API endpoints for services, bookings, and reviews that the frontend will need.

## Steps
1. In `frontend/src/slices/navSlice.js`:
   - Remove the `asyncNavSlice` injection (lines 33-43) that creates `getTravelTimeInformation` endpoint for `/api/directions` -- this backend endpoint doesn't exist and directions are handled client-side via `useDirections.jsx`
   - Remove the export of `useGetTravelTimeInformationQuery` (line 46)
   - Keep the rest of the navSlice (origin, destination, travelTimeInformation state)

2. In `frontend/src/slices/usersSlice.js`:
   - The `profile` mutation points to `PUT ${USERS_URL}/profile` -- this should work after task 03 adds the route. Verify the method and body structure match what the backend expects.
   - Add a `getProviders` query endpoint that fetches providers specifically: `GET /api/users?role=provider` or just filters from `getAllUsers`. For now, since the backend doesn't support query params, leave `getAllUsers` as-is. The frontend can filter.
   - Add a `getUserServices` query to fetch services for a specific user: `GET /api/users/:id/services`
   - Add a `getUserReviews` query to fetch reviews for a specific user: `GET /api/users/:id/reviews`

3. In `frontend/src/constants.js`:
   - Add: `export const SERVICES_URL = '/api/services';`
   - Add: `export const BOOKINGS_URL = '/api/bookings';`
   - Add: `export const REVIEWS_URL = '/api/reviews';`

## Must-Haves
- [ ] No reference to `/api/directions` in `navSlice.js`
- [ ] `useGetTravelTimeInformationQuery` export is removed from `navSlice.js`
- [ ] `usersSlice` has `getUserServices` and `getUserReviews` query endpoints
- [ ] `constants.js` has URL constants for services, bookings, and reviews
- [ ] Existing query/mutation hooks still exported and functional

## Must-Nots
- Do not modify the `apiSlice.js` base configuration
- Do not change the auth-related mutations (localLogin, logout, localRegister)
- Do not remove the `getAllUsers` query -- other components depend on it
- Do not modify backend files

## Verify
```bash
# Check navSlice has no directions reference
grep -n "directions\|getTravelTime" frontend/src/slices/navSlice.js

# Check usersSlice has new endpoints
grep -n "getUserServices\|getUserReviews" frontend/src/slices/usersSlice.js

# Check constants has new URLs
grep -n "SERVICES_URL\|BOOKINGS_URL\|REVIEWS_URL" frontend/src/constants.js

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
