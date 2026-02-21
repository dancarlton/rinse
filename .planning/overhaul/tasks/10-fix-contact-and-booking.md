# Task: Fix Contact Form and Booking Page

**Depends on:** 04-fix-backend-config, 06-fix-map-and-providers
**Files:** ~4

## Context (read these first)
- `frontend/src/components/ContactForm.jsx` -- Contact form with First Name, Last Name, Email, and Message fields. The form `action='#'` and the "Contact Us" button has no `onClick` handler. The form does nothing when submitted.
- `frontend/src/pages/BookingPage.jsx` -- Booking page. Has multiple issues:
  - Line 9: `providerData` is initialized to `true` (a boolean) instead of null or actual data
  - Line 35-40: `useEffect` defines an async `doIt()` function that calls a hardcoded Calendly API URL for user `vguzman812` with a broken env var `import.meta.env.VITE_` (no key name after VITE_). The function is defined but never called.
  - Line 56: `InlineWidget` uses hardcoded Calendly URL `https://calendly.com/vguzman812`
  - The page uses `useParams()` to get `:name` but after task 06, routes use `:id`
  - Lines 47-53: Displays `providerData.name` and `providerData.service` but `providerData` is just `true`
- `frontend/src/pages/protected/DashCalendarPage.jsx` -- Dashboard calendar page. Same issues: hardcoded Calendly URL for `vguzman812`, broken env var `VITE_`, unused `doIt()` function.
- `backend/services/emailServices.js` -- Resend email service with `sendEmail` function. Available for contact form backend.
- `frontend/src/main.jsx` -- After task 06, booking route is `/provider/:id/bookings`

## Objective
Fix the contact form to actually submit (either via a backend endpoint or client-side email service), and fix the booking page to: (1) load the correct provider data using `:id` param, (2) remove hardcoded Calendly URLs and broken env vars, (3) show a proper booking UI or placeholder.

## Steps
1. In `frontend/src/components/ContactForm.jsx`:
   - Add state management for form fields (firstName, lastName, email, message) using `useState`
   - Add an `onSubmit` handler to the form that prevents default and either:
     - Option A (simpler): Create a backend endpoint `POST /api/contact` that sends an email via Resend
     - Option B (simplest): Use a `mailto:` link or show a success toast without backend integration
   - Recommended approach: Add a simple `POST /api/contact` backend route. Create a minimal handler:
     - In `backend/routes/index.js`, add a contact route
     - Create `backend/controllers/contactController.js` with a handler that uses `EmailService.sendEmail()` to send the contact form data to the configured `SENDING_EMAIL`
   - Wire the "Contact Us" button to submit the form
   - Show a success/error toast using `react-toastify`
   - Add `onChange` handlers to all input fields

2. In backend, create the contact endpoint:
   - Create `backend/controllers/contactController.js`:
     ```javascript
     import EmailService from '../services/emailServices.js';
     
     const contactController = {
       submitContact: async (req, res) => {
         const { firstName, lastName, email, message } = req.body;
         if (!email || !message) {
           return res.status(400).json({ message: 'Email and message are required' });
         }
         const emailData = {
           to: process.env.SENDING_EMAIL || 'hello@dancalabs.com',
           from: process.env.SENDING_EMAIL || 'onboarding@resend.dev',
           subject: `Contact Form: ${firstName} ${lastName}`,
           html: `<p>From: ${firstName} ${lastName} (${email})</p><p>${message}</p>`,
         };
         await EmailService.sendEmail(emailData);
         return res.status(200).json({ message: 'Message sent successfully' });
       },
     };
     export default contactController;
     ```
   - In `backend/routes/index.js`, add: `app.post('/api/contact', contactController.submitContact);` and import the controller

3. In `frontend/src/pages/BookingPage.jsx`:
   - Change `useParams()` to extract `id` instead of `name` (since task 06 changed routes to `:id`)
   - Remove the broken `useEffect` with the hardcoded Calendly API call and broken `VITE_` env var
   - Remove `providerData` state initialized to `true`
   - Use `useGetOneUserQuery(id)` from `../../slices/usersSlice` to fetch the provider
   - For the Calendly InlineWidget: Since Calendly integration requires each provider to have their own Calendly URL (which isn't stored in the DB), replace the hardcoded URL with a placeholder message explaining that booking integration is coming soon. OR if keeping Calendly, add a `calendlyUrl` field concept but show a "Booking coming soon" message when the provider doesn't have one.
   - Update the header to show the actual provider name from the query data
   - Remove the `axios` import (unused after cleanup)

4. In `frontend/src/pages/protected/DashCalendarPage.jsx`:
   - Remove the broken `useEffect` with the hardcoded Calendly API call and `VITE_` env var
   - Remove the `axios` import
   - The `InlineWidget` with `https://calendly.com/vguzman812` should either:
     - Be removed and replaced with a "Calendar integration coming soon" placeholder
     - Or be made configurable via the user's profile (but there's no `calendlyUrl` field on the User model)
   - Recommended: Replace with a placeholder message. Keep the `useCalendlyEventListener` import for future use but wrap the InlineWidget in a conditional:
     ```jsx
     {/* TODO: Replace with user's Calendly URL from profile */}
     <div className="flex flex-col items-center justify-center py-20">
       <h2 className="text-2xl font-bold mb-2">Calendar</h2>
       <p className="text-gray-500">Calendar integration coming soon. Connect your Calendly account in profile settings.</p>
     </div>
     ```
   - Remove the `useState` import if no longer used

## Must-Haves
- [ ] Contact form has working submit handler with state management for all fields
- [ ] Backend `POST /api/contact` endpoint exists and sends email via Resend
- [ ] Contact form shows success/error feedback via toast
- [ ] BookingPage uses `:id` param and fetches provider via RTK Query
- [ ] No hardcoded Calendly URL `vguzman812` anywhere in the codebase
- [ ] No broken `import.meta.env.VITE_` (without a key name) anywhere
- [ ] No unused `axios` imports in BookingPage or DashCalendarPage

## Must-Nots
- Do not build a full booking/payment system -- this is about fixing broken code, not adding features
- Do not modify the Resend email service (`emailServices.js`) beyond what's needed
- Do not remove the `react-calendly` dependency (it may be used later)
- Do not change routes in `main.jsx` (task 06 already handled that)

## Verify
```bash
# Check no hardcoded Calendly URL
grep -rn "vguzman812" frontend/src/

# Check no broken VITE_ env var
grep -rn "VITE_," frontend/src/
grep -rn 'VITE_[^A-Z_]' frontend/src/

# Check contact controller exists
ls backend/controllers/contactController.js

# Check contact route is mounted
grep -n "contact" backend/routes/index.js

# Check ContactForm has state and handlers
grep -n "useState\|onChange\|onSubmit\|handleSubmit" frontend/src/components/ContactForm.jsx

# Check BookingPage uses :id
grep -n "useParams\|useGetOneUser" frontend/src/pages/BookingPage.jsx

# Build check
cd frontend && npx vite build --mode development 2>&1 | tail -5
```
