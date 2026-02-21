# Task: Fix User Model

**Depends on:** none
**Files:** ~2

## Context (read these first)
- `backend/models/userModel.js` -- The User mongoose model with schema, pre-save hook, and instance methods
- `backend/seeder.js` -- Seeds the database; shows what fields are expected

## Objective
Fix three bugs in the User model: (1) the `name` field is required but registration and Google OAuth don't provide it, so make it optional with a default; (2) the `role` field is required but registration doesn't provide it, so add a default; (3) the `updateRating` method references bare `numRatings` and `rating` variables instead of `this.numRatings` and `this.rating`; (4) remove the `hashPassword` instance method since the `pre('save')` hook already handles hashing -- having both causes double-hashing when called together.

## Steps
1. In `backend/models/userModel.js`, change the `name` field: remove `required: [true, 'Name is required']` and add `default: ''` so users can register with just email/password and fill in their name later.
2. In `backend/models/userModel.js`, change the `role` field: add `default: 'user'` so new registrations default to the `user` role. Keep the `enum` validation but remove `required: true`.
3. In `backend/models/userModel.js`, fix the `updateRating` method on line 98: change `numRatings * rating` to `this.numRatings * this.rating`.
4. In `backend/models/userModel.js`, remove the `hashPassword` instance method entirely. The `pre('save')` hook on lines 84-89 already handles password hashing on save. The `hashPassword` method is only called in `userController.js` `createUserLocal` which we fix in task 02.
5. In `backend/services/userServices.js`, the `setUserPassword` function calls `user.hashPassword()` on line 24. Change this to just set `user.password = password;` and remove the `hashPassword()` call -- the `pre('save')` hook will handle hashing when `saveUser(user)` is called afterward. Also remove `passwordResetToken` and `passwordResetExpires` assignments since those fields don't exist on the model (they were from commented-out code).

## Must-Haves
- [ ] `name` field has `default: ''` and is not required
- [ ] `role` field has `default: 'user'` and is not required
- [ ] `updateRating` uses `this.numRatings` and `this.rating`
- [ ] No `hashPassword` instance method exists on the schema
- [ ] `pre('save')` hook remains unchanged (it correctly checks `isModified('password')`)

## Must-Nots
- Do not change the `comparePassword` or `hidePassword` methods
- Do not change the `pre('save')` hook
- Do not modify the PointSchema or any other field definitions beyond `name` and `role`
- Do not touch any frontend files

## Verify
```bash
node -e "
import('./backend/models/userModel.js').then(m => {
  const schema = m.User.schema;
  const namePath = schema.path('name');
  const rolePath = schema.path('role');
  console.log('name required:', namePath.isRequired);
  console.log('name default:', namePath.defaultValue);
  console.log('role required:', rolePath.isRequired);
  console.log('role default:', rolePath.defaultValue);
  console.log('hashPassword method exists:', typeof schema.methods.hashPassword);
  console.log('updateRating method exists:', typeof schema.methods.updateRating);
  // Check updateRating source for 'this.'
  const src = schema.methods.updateRating.toString();
  console.log('updateRating uses this.numRatings:', src.includes('this.numRatings'));
  process.exit(0);
});
"
```
