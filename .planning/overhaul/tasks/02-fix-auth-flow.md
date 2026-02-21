# Task: Fix Auth Flow (Registration, Local Login, Google OAuth)

**Depends on:** 01-fix-user-model
**Files:** ~3

## Context (read these first)
- `backend/controllers/userController.js` -- Contains `createUserLocal` which has double-hashing bug
- `backend/controllers/authController.js` -- Contains `localLogin` and Google OAuth handlers
- `backend/config/passport.js` -- Passport strategies for local and Google auth
- `backend/models/userModel.js` -- User model (after task 01 fixes)
- `backend/validations/userValidation.js` -- Joi validation schemas

## Objective
Fix three auth bugs: (1) `createUserLocal` calls `hashPassword()` then `save()` causing double-hashing -- remove the `hashPassword()` call since the pre-save hook handles it; (2) Google OAuth `User.create()` only sends `googleId` and `email` but was missing `name` (now optional after task 01) -- add name from Google profile; (3) `localLogin` has a bug on line 93 where `req.login(user, (e = err) => ...)` should be `(e) => ...` and the error handling sends the wrong response.

## Steps
1. In `backend/controllers/userController.js`, in the `createUserLocal` method (line ~83-148):
   - Remove line 106 (`await newUser.hashPassword();`) -- the `pre('save')` hook on the model already hashes the password when `save()` is called
   - The `User.create({ email, password })` call on line 105 already triggers the pre-save hook, so also remove the separate `await newUser.save()` on line 144 since `create()` already persists. OR change `User.create()` to `new User()` + `save()` for clarity. Pick whichever is cleaner -- just ensure password is hashed exactly once.

2. In `backend/config/passport.js`, in the Google Strategy callback (line ~59-65):
   - Update `User.create()` to include `name` from the Google profile: `name: profile.displayName || profile.emails[0].value`
   - This isn't strictly required anymore since task 01 made `name` optional, but it's good UX to capture the name from Google

3. In `backend/controllers/authController.js`, fix the `localLogin` function (line ~64-101):
   - Line 93: Change `req.login(user, (e = err) => {` to `req.login(user, (e) => {`
   - Fix the error handling: currently if `e` is truthy, it sends `user` (the raw user), and the success path sends `user.hidePassword()`. The logic should be: if error, send error response; if success, send user without password.
   - Change to:
     ```javascript
     req.login(user, (e) => {
       if (e) {
         return res.status(500).send({ message: 'Login failed' });
       }
       return res.send(user.hidePassword());
     });
     ```

## Must-Haves
- [ ] Registration creates a user with password hashed exactly once
- [ ] `createUserLocal` no longer calls a `hashPassword()` instance method
- [ ] Google OAuth includes `name` from the Google profile in `User.create()`
- [ ] `localLogin` `req.login` callback has correct error handling
- [ ] `comparePassword` still works for local login (i.e., password stored correctly)

## Must-Nots
- Do not modify the Joi validation schemas
- Do not add or remove route definitions (that's task 03)
- Do not touch the passport strategy configuration beyond the Google callback data
- Do not modify frontend files

## Verify
```bash
# Start the server and test registration
doppler run -- node -e "
import('./backend/server.js').then(async () => {
  const res = await fetch('http://localhost:5050/api/users/local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test-overhaul@test.com', password: 'Test123!' })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  process.exit(0);
});
"
```
