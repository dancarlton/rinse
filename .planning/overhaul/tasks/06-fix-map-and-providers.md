# Task: Fix Map Component and Provider Page

**Depends on:** 05-fix-frontend-api-layer
**Files:** ~3

## Context (read these first)
- `frontend/src/components/Map/index.jsx` -- Map component that shows provider markers. References `user.locations` (plural) but the User model field is `location` (singular GeoJSON `{ type: 'Point', coordinates: [lng, lat] }`)
- `frontend/src/pages/ProviderPage.jsx` -- Provider detail page. Currently fetches ALL users via raw `fetch('/api/users')` and filters by name string. Has many TODOs.
- `frontend/src/data/users.js` -- Frontend seed data with `locations: { latitude, longitude }` format -- this is the OLD format, the DB model uses GeoJSON `location: { type: 'Point', coordinates: [lng, lat] }`
- `frontend/src/slices/usersSlice.js` -- After task 05, has `getUserServices` and `getUserReviews` endpoints
- `backend/models/userModel.js` -- User model `location` field is GeoJSON PointSchema: `{ type: 'Point', coordinates: [longitude, latitude] }`

## Objective
Fix two major frontend issues: (1) The Map component references `user.locations` (plural, with `latitude`/`longitude` sub-fields) but the actual DB model uses `user.location` (singular, GeoJSON format with `coordinates: [lng, lat]`); (2) The ProviderPage fetches all users and finds by name -- change it to use the `getOneUser` RTK Query by provider ID, and use the new `getUserServices`/`getUserReviews` endpoints to load related data.

## Steps
1. In `frontend/src/components/Map/index.jsx`:
   - Fix the provider location extraction (lines 50-58). Currently:
     ```javascript
     locations = users
       .filter((user) => user.locations && user.role === 'provider')
       .map((provider) => ({
         id: provider._id,
         position: {
           lat: Number(provider.locations.latitude),
           lng: Number(provider.locations.longitude),
         },
       }));
     ```
   - Change to use the correct field name and GeoJSON format:
     ```javascript
     locations = users
       .filter((user) => user.location && user.role === 'provider')
       .map((provider) => ({
         id: provider._id,
         name: provider.name,
         position: {
           lat: provider.location.coordinates[1],  // GeoJSON: [lng, lat]
           lng: provider.location.coordinates[0],
         },
       }));
     ```

2. In `frontend/src/pages/ProviderPage.jsx`:
   - Replace the raw `fetch('/api/users')` + filter-by-name approach with RTK Query
   - Change the route parameter from `:name` to `:id` -- this requires updating the router in `main.jsx` as well
   - Use `useGetOneUserQuery(id)` to fetch the provider
   - Use the new `useGetUserServicesQuery(id)` and `useGetUserReviewsQuery(id)` to fetch related data
   - Update the JSX to render services and reviews from separate queries instead of `providerData.services` and `providerData.reviews` (which don't exist on the DB user model -- services and reviews are in separate collections)
   - Remove the `serviceArea` reference (line 82) -- this field doesn't exist on the DB model

3. In `frontend/src/main.jsx`:
   - Change the provider route from `/provider/:name` to `/provider/:id`
   - Change the booking route from `/provider/:name/bookings` to `/provider/:id/bookings`

## Must-Haves
- [ ] Map component uses `user.location.coordinates` (GeoJSON format) not `user.locations`
- [ ] ProviderPage uses RTK Query `useGetOneUserQuery` instead of raw fetch
- [ ] ProviderPage loads services and reviews from separate API calls
- [ ] Routes use `:id` parameter instead of `:name`
- [ ] No reference to `user.locations` (plural) anywhere in the Map component

## Must-Nots
- Do not modify the Map's Mapbox integration or styling
- Do not change the `useDirections` hook
- Do not modify backend files
- Do not change the ProviderMarker component (it receives position props correctly)

## Verify
```bash
# Check Map component uses correct field
grep -n "location\." frontend/src/components/Map/index.jsx
grep -n "locations" frontend/src/components/Map/index.jsx  # should find no matches

# Check ProviderPage uses RTK Query
grep -n "useGetOneUser\|useGetUserServices\|useGetUserReviews" frontend/src/pages/ProviderPage.jsx

# Check routes use :id
grep -n "provider/:id\|provider/:name" frontend/src/main.jsx

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
