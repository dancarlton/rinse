# Task: Fix ServiceList and Card Components

**Depends on:** 05-fix-frontend-api-layer
**Files:** ~2

## Context (read these first)
- `frontend/src/components/ServiceList.jsx` -- Fetches all users via raw `fetch('/api/users')`, filters for providers, but the real data rendering is commented out. Instead renders 9 hardcoded `<Card />` components.
- `frontend/src/components/Card.jsx` -- Has the original dynamic Card component code commented out. Currently renders a hardcoded "Exterior Wash" card with no props. The commented-out version expected `service`, `servicerName`, `numReviews` props.
- `frontend/src/pages/MapPage.jsx` -- Renders `ServiceList` component alongside the map
- `backend/controllers/serviceController.js` -- `GET /api/services` returns all services from DB

## Objective
Fix the ServiceList and Card components so they display real service data from the API instead of hardcoded placeholders. ServiceList should fetch all services (or provider services) from the API, and Card should accept service data as props and render dynamically.

## Steps
1. In `frontend/src/components/Card.jsx`:
   - Remove the hardcoded "Exterior Wash" JSX
   - Restore and update the commented-out dynamic Card component, adapting it to match the Service model from the DB. The DB Service model has: `provider` (ObjectId), `title`, `description`, `price`, `estimatedTime`, `photo`
   - The card should accept props: `service` (object with title, description, price, estimatedTime, photo), `providerName` (string), `providerId` (string for linking)
   - Link the card to `/provider/${providerId}` instead of `/provider/${servicerName}` (after task 06 changes routes to use IDs)
   - Display the service photo, title, price, and description

2. In `frontend/src/components/ServiceList.jsx`:
   - Remove the raw `fetch('/api/users')` call
   - Use RTK Query to fetch services. Either:
     - Option A: Import and use a new `useGetAllServicesQuery` (add to usersSlice or a new servicesSlice)
     - Option B: Continue fetching users and their services, but use RTK Query
   - Option A is cleaner: Add a `getAllServices` query endpoint in the usersSlice or create it inline
   - For the "Recommended" / "Best Deals" / "Quickest Service" sections, group services by some criteria (e.g., highest rated provider for recommended, lowest price for best deals, lowest estimatedTime for quickest)
   - If not enough data for grouping, just show all services in a single list
   - Replace the hardcoded `<Card />` components with mapped service data: `services.map(service => <Card key={service._id} service={service} ... />)`

## Must-Haves
- [ ] Card component renders dynamic data from props (title, price, description, photo)
- [ ] Card links to `/provider/:id` with a real provider ID
- [ ] ServiceList fetches real service data from the API
- [ ] No hardcoded "Exterior Wash" text in Card component
- [ ] No commented-out code blocks remain in Card or ServiceList

## Must-Nots
- Do not change the MapPage layout
- Do not modify the Map component
- Do not change backend files
- Do not remove the category headings ("Recommended", "Best Deals", "Quickest Service") -- it's fine to keep them even if the grouping logic is simple

## Verify
```bash
# Check no hardcoded content
grep -n "Exterior Wash" frontend/src/components/Card.jsx  # should find nothing

# Check Card accepts props
grep -n "props\|service\|title\|price" frontend/src/components/Card.jsx

# Check ServiceList uses RTK Query or API
grep -n "useGet\|fetch\|query" frontend/src/components/ServiceList.jsx

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
