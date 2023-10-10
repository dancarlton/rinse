/* eslint-disable import/no-named-as-default-member */
import sanitize from "mongo-sanitize";
import passport from "passport";
import dayjs from "dayjs";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
} from "../validations/userValidation.js";

import UserService from "../services/userServices.js";
import TokenService from "../services/tokenServices.js";
// import LoggerService from "../services/loggerServices.js";
import EmailService from "../services/emailServices.js";

const clientHost = "http://localhost:5173";

export const loginFail = (req, res) => {
  res.status(401).json({
    success: false,
    message: "Failure to login",
  });
};

export const loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user,
      cookies: req.cookies,
    });
  }
};

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.redirect(clientHost);
  });
};

// for local
// export const postLogin = (req, res, next) => {
//   const { error } = validateLoginInput(req.body);

//   if (error) return res.status(400).send({ message: error.details[0].message });

//   const sanitizedInput = sanitize(req.body);

//   sanitizedInput.username = req.body.username.toLowerCase();

//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (info && info.message === "Missing credentials") {
//       return res.status(400).send({ message: "Missing credentials" });
//     }
//     if (!user) {
//       return res.status(400).send({ message: "Invalid email or password." });
//     }
//     // optional verification
//     // if (!user.isVerified) {
//     //   return res.status(401).send({
//     //     message:
//     //       "Your account has not been verified. Please activate your account.",
//     //   });
//     // }
//     req.login(user, (e = err) => {
//       if (e) {
//         res.status(401).send({ message: "Authentication failed", e });
//       }
//       res.status(200).send({
//         message: "Login success",
//         user: UserService.getUser(user),
//       });
//     });
//   })(req, res, next);
// };

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
  loginFail,
  loginSuccess,
  logoutUser,
};
