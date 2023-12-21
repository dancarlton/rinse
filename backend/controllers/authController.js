import sanitize from 'mongo-sanitize';
import passport from 'passport';
import dayjs from 'dayjs';
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
} from '../validations/userValidation.js';

import UserService from '../services/userServices.js';
import TokenService from '../services/tokenServices.js';
// import LoggerService from "../services/loggerServices.js";
import EmailService from '../services/emailServices.js';
import { logger } from '../config/logging.js';

// client host is either deployed base url or local host environment
const clientHost =
  process.env.NODE_ENV === 'production'
    ? 'https://rinse-copy.onrender.com'
    : 'http://localhost:5173/';

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
  // scope tells us how much to ask from google
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
    // Successful authentication, redirect to client
    res.redirect(clientHost);
  });
};

/**
 * @desc Local login strategy from passport.js
 * @route /login/local
 * @method POST
 */
export const localLogin = (req, res, next) => {
  // check for proper input from client
  const { error } = validateLoginInput(req.body);

  if (error) return res.status(400).send({ message: 'Invalid inputs.' });

  // sanitize input for malicious users
  const sanitizedInput = sanitize(req.body);

  sanitizedInput.email = req.body.email.toLowerCase();

  // passport authentication
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
    // optional verification
    // if (!user.isVerified) {
    //   return res.status(401).send({
    //     message:
    //       "Your account has not been verified. Please activate your account.",
    //   });
    // }
    req.login(user, (e = err) => {
      if (e) {
        // eventually redirect to client
        res.send(user);
      }
      res.send(user.hidePassword());
    });
  })(req, res, next);
};

// // takes in user email and either no user found or try to send reset password email
// export const postLoginForgot = async (req, res) => {
//   const { error } = validateEmail(req.body);
//   if (error) return res.status(400).send({ message: error.details[0].message });

//   const sanitizedInput = sanitize(req.body);

//   try {
//     const user = await UserService.findUserBy("email", sanitizedInput.email);
//     if (!user) {
//       return res
//         .status(404)
//         .send({ message: "No user found with this email address." });
//     }
//     const resetToken = TokenService.createToken();
//     const tokenExpiryDate = dayjs().add(12, "hours").toDate();

//     TokenService.setUserId(resetToken, user.id);
//     UserService.setResetPasswordToken(user, resetToken.token, tokenExpiryDate);

//     await UserService.saveUser(user);
//     await TokenService.saveToken(resetToken);

//     try {
//       const email = EmailService.createResetPasswordEmail(
//         user.email,
//         resetToken.token
//       );
//       await EmailService.sendEmail(email);

//       return res.status(200).send({
//         message: `A reset passowrd email has been sent to ${user.email}`,
//       });
//     } catch (err) {
//       LoggerService.log.error(err);

//       return res.status(503).send({
//         message: `Impossible to send an email to ${user.email}, try again. Our service may be down.`,
//       });
//     }
//   } catch (err) {
//     LoggerService.log.error(err);

//     return res.status(500).send({ message: "An unexpected error occurred" });
//   }
// };

// // user navigates here from reset password email
// // token should be a parameter in the url
// // expects new password from body
// export const postLoginReset = async (req, res) => {
//   const { error } = validatePassword(req.body);
//   if (error) return res.status(400).send({ message: error.details[0].message });
//   const sanitizedInput = sanitize(req.body);

//   try {
//     const token = await TokenService.findTokenBy("token", req.params["token"]);
//     if (!token) {
//       return res.status(404).send({
//         message: "This token is not valid. Your token may have expired.",
//       });
//     }

//     const user = await UserService.findUserById(token._userId);

//     if (!user) {
//       return res.status(404).send({
//         message: `We were unable to find a user for this token.`,
//       });
//     }

//     if (user.passwordResetToken !== token.token) {
//       return res.status(400).send({
//         message:
//           "User token and your token didn't match. You may have a more recent token in your mail list.",
//       });
//     }

//     // Verify that the user token expires date has not been passed
//     if (dayjs().toDate() > user.passwordResetExpires) {
//       return res.status(400).send({
//         message:
//           "You cannot reset your password. The reset token has expired. Please go through the reset form again.",
//       });
//     }
//     // Update user
//     await UserService.setUserPassword(user, sanitizedInput.password);
//     await UserService.saveUser(user);

//     try {
//       const email = EmailService.createResetConfirmationEmail(user.email);
//       await EmailService.sendEmail(email);
//       return res
//         .status(200)
//         .send({ message: "Password has been successfully changed." });
//     } catch (err) {
//       LoggerService.log.error(err);

//       return res.status(503).send({
//         message: `Impossible to send an email to ${user.email}, try again. Our service may be down.`,
//       });
//     }
//   } catch (err) {
//     LoggerService.log.error(err);

//     return res.status(500).send("An unexpected error occurred");
//   }
// };

// export const postLogout = (req, res) => {
//   console.log("Hello from logout")
//   req.logout((err) => {
//     if (err) {
//       res.status(500).send({ message: "Logout failed", err });
//     } else {
//       req.sessionID = "";
//       res.status(200).send({ message: "Logout success" });
//     }
//   });
// };

// // Send user a new account verification email
// // requires email from body
// export const postVerify = async (req, res) => {
//   const { error } = validateEmail(req.body);
//   if (error) return res.status(400).send({ message: error.details[0].message });

//   const sanitizedInput = sanitize(req.body);

//   try {
//     const user = await UserService.findUserBy("email", sanitizedInput.email);
//     if (!user) {
//       return res
//         .status(404)
//         .send({ message: "No user found with this email address." });
//     }
//     if (user.isVerified) {
//       return res.status(400).send({
//         message: "This account has already been verified. Please log in.",
//       });
//     }

//     const verificationToken = TokenService.createToken();
//     TokenService.setUserId(verificationToken, user.id);

//     await TokenService.saveToken(verificationToken);
//     try {
//       const email = EmailService.createVerificationEmail(
//         user.email,
//         verificationToken.token
//       );
//       await EmailService.sendEmail(email);

//       return res
//         .status(200)
//         .send({ message: `A verification email has been sent.` });
//     } catch (err) {
//       LoggerService.log.error(err);

//       return res.status(503).send({
//         message: `Impossible to send an email to ${user.email}, try again. Our service may be down.`,
//       });
//     }
//   } catch (err) {
//     LoggerService.log.error(err);

//     return res.status(500).send("An unexpected error occurred");
//   }
// };

// // user navigates here from verification email
// // token found in path param
// export const getConfirmation = async (req, res) => {
//   try {
//     const token = await TokenService.findTokenBy("token", req.params.token);

//     if (!token) {
//       return res.status(404).send({
//         message:
//           "We were unable to find a valid token. Your token may have expired.",
//       });
//     }

//     const user = await UserService.findUserById(token._userId);

//     if (!user) {
//       return res.status(404).send({
//         message: `We were unable to find a user for this token.`,
//       });
//     }

//     if (user.isVerified) {
//       return res.status(400).send({
//         message: "This user has already been verified. Please log in.",
//       });
//     }

//     UserService.setUserVerified(user);
//     await UserService.saveUser(user);

//     return res
//       .status(200)
//       .send({ message: "The account has been verified. Please log in." });
//   } catch (error) {
//     LoggerService.log.error(error);

//     return res.status(500).send("An unexpected error occurred");
//   }
// };

// export default {
//   postLogin,
//   postLoginReset,
//   postLogout,
//   postVerify,
//   getConfirmation,
//   postLoginForgot,
// };

export default {
  logoutUser,
  localLogin,
  googleLogin,
  googleCallback,
};
