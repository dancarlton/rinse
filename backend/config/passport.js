import passport from "passport";
import Local from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.js";

export function initPassportJS() {
  // pulled from passport JS local strategy https://www.passportjs.org/packages/passport-local/
  // must be wrapped in async await because mongoose findone returns promises now.
  // local
  passport.use(
    new Local.Strategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(undefined, false, {
            message: "Incorrect username or password",
          });
        }
        if (!user.comparePassword(password)) {
          return done(undefined, false, {
            message: "Incorrect username or password",
          });
        }
        return done(undefined, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // https://www.passportjs.org/packages/passport-google-oauth20/
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
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
            email: profile.emails[0].value, // Extracting email from Google profile
            password: null, // No password is needed for OAuth2
            // additional fields here
          });
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // passes user to client side
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((user, done) => done(null, user));

  // for local?
  //   passport.deserializeUser(async (id, done) => {
  //     try {
  //       const user = await User.findById(id);
  //       done(null, user);
  //     } catch (err) {
  //       done(err);
  //     }
  //   });
}
