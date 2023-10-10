/* eslint-disable import/no-named-as-default-member */
import sanitize from "mongo-sanitize";
import bcrypt from "bcryptjs";
import {
  validateEmail,
  validateRegisterInput,
} from "../validations/userValidation.js";

import UserService from "../services/userServices.js";
import TokenService from "../services/tokenServices.js";
import LoggerService from "../services/loggerServices.js";
import EmailService from "../services/emailServices.js";
import User from "../models/userModel.js";

// export const getUser = (req, res) => {
//   const { user } = req;

//   res.status(200).send({ message: "User info successfully retreived", user });
// };

/**
 * @description get all users in db
 * @route /api/users
 * @method GET
 * @returns an array of all user objects from DB
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.log("error ", error);
    return error;
  }
};

/**
 * @description get one user by _id
 * @route /api/users/:id
 * @method GET
 * @returns a javascript object, user. currently gets all info
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log("There's been an Error, Harry. ", error);
    res.status(404).end();
  }
};

/**
 * @description update one user by _id
 * @route /api/users/:id
 * @method PUT
 * @returns a javascript object, with fields changed and success or failure message
 */
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const user = await User.findById(id);
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = bcrypt.hashSync(password, 10);
    await user.save();
    return res
      .status(200)
      .json({ message: "user information updated successfully." });
  } catch (error) {
    res
      .status(404)
      .json({ message: "user information could not be updated." })
      .end();
  }
};

/**
 * @description delete one user by _id
 * @route /api/users/:id
 * @method DELETE
 * @returns a javascript object, user. currently returns all info about deleted user
 */
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findOneAndDelete({ _id: id });
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log("There's been an Error, Harry. ", error);
    res.status(404).end();
  }
};

/**
 * @description Add a new user
 * @route POST /api/users
 * @returns {object} The newly created user
 */
export const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with that email" });
    }

    // Create a new user
    const newUser = await User.create({ username, email });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("There's been an error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
  getUserById,
  deleteUserById,
  getAllUsers,
  createUser,
  updateUserById,
  // postUser,
  // postUserCancel,
};
