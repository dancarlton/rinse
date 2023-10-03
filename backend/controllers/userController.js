/* eslint-disable import/no-named-as-default-member */
import sanitize from "mongo-sanitize";
import {
  validateEmail,
  validateRegisterInput,
} from "../validations/userValidation.js";

import UserService from "../services/userServices.js";
import TokenService from "../services/tokenServices.js";
import LoggerService from "../services/loggerServices.js";
import EmailService from "../services/emailServices.js";

export const getUser = (req, res) => {
  const { user } = req;

  res.status(200).send({ message: "User info successfully retreived", user });
};

// export const postUser = async (req, res) => {
//   // Validate Register input
//   const { error } = validateRegisterInput(req.body);
//   if (error) return res.status(400).send({ message: error.details[0].message });

//   const sanitizedInput = sanitize(req.body);

//   try {
//     let user = await UserService.findUserBy(
//       "username",
//       sanitizedInput.username.toLowerCase()
//     );

//     if (user) {
//       return res.status(400).send({
//         message: "Username already taken. Take an another Username",
//       });
//     }

//     user = await UserService.findUserBy(
//       "email",
//       sanitizedInput.email.toLowerCase()
//     );

//     if (user) {
//       return res.status(400).send({
//         message: "Email already registered. Take an another email",
//       });
//     }

//     const newUser = UserService.createUser(sanitizedInput);
//     await UserService.setUserPassword(newUser, newUser.password);
//     try {
//       await UserService.saveUser(newUser);
//       const verificationToken = TokenService.createToken();
//       TokenService.setUserId(verificationToken, newUser._id);
//       TokenService.saveToken(verificationToken);
//       const verificationEmail = EmailService.createVerificationEmail(
//         newUser.email,
//         verificationToken.token
//       );
//       try {
//         EmailService.sendEmail(verificationEmail);

//         return res
//           .status(200)
//           .send({ message: "A verification mail has been sent." });
//       } catch (err) {
//         UserService.deleteUserById(newUser._id);

//         return res.status(503).send({
//           message: `Impossible to send an email to ${newUser.email}, try again. Our service may be down.`,
//         });
//       }
//     } catch (err) {
//       LoggerService.log.error(err);

//       return res
//         .status(500)
//         .send({ message: "Creation of user failed, try again." });
//     }
//   } catch (err) {
//     LoggerService.log.error(err);

//     return res.status(500).send("An unexpected error occurred");
//   }
// };

// // delete user?
// export const postUserCancel = (req, res) => {
//   const { error } = validateEmail(req.body);
//   if (error) return res.status(400).send({ message: error.details[0].message });

//   const sanitizedInputs = sanitize(req.body);

//   try {
//     UserService.deleteUnverifiedUserByEmail(sanitizedInputs.email);
//     return res.status(200).send({ message: "User reset success" });
//   } catch (err) {
//     return res.status(500).send("An unexpected error occurred");
//   }
// };

export default {
  getUser,
  // postUser,
  // postUserCancel,
};
