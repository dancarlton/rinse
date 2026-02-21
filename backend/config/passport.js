import passport from 'passport';
import Local from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';

export function initPassportJS() {
  // pulled from passport JS local strategy https://www.passportjs.org/packages/passport-local/
  // must be wrapped in async await because mongoose findone returns promises now.
  // local
  passport.use(
    new Local.Strategy(
      {
        usernameField: 'email', // using email instead of username
        passwordField: 'password',
      },
      async (email, password, cb) => {
        try {
          const user = await User.findOne({ email });
          // if user does not exist
          if (!user) {
            return cb(null, false, {
              message: 'Incorrect username or password',
            });
          }
          // if password is incorrect
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return cb(null, false, {
              message: 'Incorrect username or password',
            });
          }
          // else return the user
          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );

  // https://www.passportjs.org/packages/passport-google-oauth20/
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5050/api/auth/google/callback',
          passReqToCallback: true,
        },
        // find user by google id or create user
        async (request, accessToken, refreshToken, profile, done) => {
          try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
              return done(null, user);
            }
            const newUser = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName || profile.emails[0].value,
              password: null, // No password is needed for OAuth2
            });
            return done(null, newUser);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  // passes user id to client side
  passport.serializeUser((user, cb) => {
    cb(null, user._id.toString());
  });

  // returrn as much user info as you want via deserialization to req.user
  passport.deserializeUser(async (_id, cb) => {
    try {
      const user = await User.findById(_id);
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  });
}
