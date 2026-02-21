import sanitize from 'mongo-sanitize';
import passport from 'passport';
import { validateLoginInput } from '../validations/userValidation.js';

const clientHost = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * @desc Logs out user
 * @route /logout
 * @method POST
 */
export const logoutUser = (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.status(500).send({ message: 'Logout failed', err });
    } else {
      res.status(200).send({ message: 'Logout success' });
    }
  });
};

/**
 * @desc Google OAuth 2.0 via passport
 * @route /google
 * @method GET
 */
export const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

/**
 * @desc Google OAuth 2.0 via passport callback. used to redirect after authentication
 * @route /google/callback
 * @method GET
 */
export const googleCallback = (req, res) => {
  passport.authenticate('google', {
    failureRedirect: clientHost,
    successMessage: true,
    failureMessage: true,
  })(req, res, () => {
    res.redirect(clientHost);
  });
};

/**
 * @desc Local login strategy from passport.js
 * @route /login/local
 * @method POST
 */
export const localLogin = (req, res, next) => {
  const { error } = validateLoginInput(req.body);

  if (error) return res.status(400).send({ message: 'Invalid inputs.' });

  const sanitizedInput = sanitize(req.body);
  sanitizedInput.email = req.body.email.toLowerCase();

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (info && info.message === 'Missing credentials') {
      return res.status(400).send({ info });
    }
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password.' });
    }
    req.login(user, (e) => {
      if (e) {
        return res.status(500).send({ message: 'Login failed' });
      }
      return res.send(user.hidePassword());
    });
  })(req, res, next);
};

export default {
  logoutUser,
  localLogin,
  googleLogin,
  googleCallback,
};
