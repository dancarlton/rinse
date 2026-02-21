# Task: Fix Backend Routes and Apply Auth Middleware

**Depends on:** 01-fix-user-model, 02-fix-auth-flow
**Files:** ~6

## Context (read these first)
- `backend/routes/index.js` -- Mounts all route groups
- `backend/routes/userRoutes.js` -- User CRUD + nested service/booking/review routes
- `backend/routes/bookingRoutes.js` -- Booking CRUD (no create route)
- `backend/routes/serviceRoutes.js` -- Service CRUD (no create route)
- `backend/routes/reviewRoutes.js` -- Review CRUD (no create route)
- `backend/routes/authRoutes.js` -- Auth routes (login, logout, Google)
- `backend/middleware/authMiddleware.js` -- Has `authenticated`, `admin`, `provider` middleware but none are used
- `backend/middleware/checkObjectId.js` -- ObjectId validator, also unused
- `backend/controllers/userController.js` -- User controller with nested resource handlers
- `frontend/src/slices/usersSlice.js` -- Frontend expects a `PUT /api/users/profile` endpoint that doesn't exist
- `frontend/src/slices/navSlice.js` -- Frontend expects a `POST /api/directions` endpoint that doesn't exist

## Objective
Apply auth middleware to routes that need protection, add missing endpoints the frontend expects, and add ObjectId validation to routes with `:id` params. The frontend expects:
1. `PUT /api/users/profile` -- update the current user's own profile (usersSlice `profile` mutation)
2. Provider-related queries: The frontend `Map/index.jsx` calls `useGetAllUsersQuery` and filters for providers -- this works but should ideally have a dedicated endpoint. For now, ensure the existing `/api/users` returns user data with `location` field.

## Steps
1. In `backend/routes/userRoutes.js`:
   - Import `{ authenticated, admin, provider }` from `../middleware/authMiddleware.js`
   - Import `checkObjectId` from `../middleware/checkObjectId.js`
   - Add `authenticated` middleware to: `GET /current`, `PUT /:id`, `DELETE /:id`, all POST routes that create resources (`:id/services`, `:id/bookings`, `:id/reviews`)
   - Add `checkObjectId` middleware to all routes with `:id` param
   - Add a new route: `PUT /profile` that calls a new `updateCurrentUserProfile` controller method (or reuse `updateUserById` with `req.user._id`)

2. In `backend/controllers/userController.js`:
   - Add a `updateCurrentUserProfile` method that uses `req.user._id` instead of `req.params.id` to update the logged-in user's own profile. This is what the frontend's `profile` mutation calls.

3. In `backend/routes/bookingRoutes.js`:
   - Import and apply `authenticated` middleware to PUT and DELETE routes
   - Import and apply `checkObjectId` to `:id` routes

4. In `backend/routes/serviceRoutes.js`:
   - Import and apply `authenticated` middleware to PUT and DELETE routes
   - Import and apply `checkObjectId` to `:id` routes

5. In `backend/routes/reviewRoutes.js`:
   - Import and apply `authenticated` middleware to PUT and DELETE routes
   - Import and apply `checkObjectId` to `:id` routes

6. In `backend/middleware/authMiddleware.js`:
   - Change the `authenticated` middleware redirect from `res.redirect('/login')` to `res.status(401).json({ message: 'Not authenticated' })` since this is an API, not a page-serving backend

## Must-Haves
- [ ] `authenticated` middleware returns 401 JSON instead of redirecting to `/login`
- [ ] `PUT /api/users/profile` route exists and requires authentication
- [ ] All `:id` routes have `checkObjectId` middleware
- [ ] POST/PUT/DELETE routes for user sub-resources require authentication
- [ ] GET routes for listing (getAllUsers, getAllServices, etc.) remain public

## Must-Nots
- Do not add the `/api/directions` endpoint -- that routing has been replaced by client-side Mapbox Directions API calls in `useDirections.jsx`
- Do not change the route path patterns (keep `/api/users`, `/api/bookings`, etc.)
- Do not modify controller logic beyond adding the new `updateCurrentUserProfile` method
- Do not touch frontend files

## Verify
```bash
# Check that the routes file imports middleware
grep -n "authenticated\|checkObjectId" backend/routes/userRoutes.js
grep -n "authenticated\|checkObjectId" backend/routes/bookingRoutes.js
grep -n "authenticated\|checkObjectId" backend/routes/serviceRoutes.js
grep -n "authenticated\|checkObjectId" backend/routes/reviewRoutes.js

# Check auth middleware returns JSON
grep -n "401\|json\|redirect" backend/middleware/authMiddleware.js
```
