import sanitize from 'mongo-sanitize';
import bcrypt from 'bcryptjs';
import { validateEmail, validateRegisterInput } from '../validations/userValidation.js';

import UserService from '../services/userServices.js';
import TokenService from '../services/tokenServices.js';
import EmailService from '../services/emailServices.js';
import User from '../models/userModel.js';
import { logger } from '../config/logging.js';
// export const getUser = (req, res) => {
//   const { user } = req;

//   res.status(200).send({ message: "User info successfully retreived", user });
// };

/**
 * @description get all users in db
 * @route /api/users
 * @method GET
 * @returns {User[]}an array of all user objects from DB
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};

/**
 * @description get current user
 * @route /api/users/current
 * @method GET
 * @returns {User}, user. currently gets all info
 */
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(404).send({ message: 'No current user' });
  }
  return res.status(200).json(req.user);
};
/**
 * @description get one user by _id
 * @route /api/users/:id
 * @method GET
 * @returns {User}, user. currently gets all info
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  return res.status(200).json(user);
};

/**
 * @description update one user by _id
 * @route /api/users/:id
 * @method PUT
 * @returns {object}, with fields changed and success or failure message
 */
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findById(id);
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = bcrypt.hashSync(password, 10);
  await user.save();
  return res.status(200).json({ message: 'user information updated successfully.' });
};

/**
 * @description delete one user by _id
 * @route /api/users/:id
 * @method DELETE
 * @returns {User}, user. currently returns all info about deleted user
 */
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findOneAndDelete({ _id: id });
  return res.status(200).json(deletedUser);
};

/**
 * @description Create a new user via local signup and send verification email to that user's email
 * @route /api/users/local
 * @method POST
 * @returns {message, User} The newly created user and a message indicating success or failure
 */
export const createUserLocal = async (req, res) => {
  // Validate Register input
  const { error } = validateRegisterInput(req.body);
  if (error) {
    return res.status(400).send({
      message: 'Invalid inputs.',
    });
  }

  const sanitizedInput = sanitize(req.body);
  const { email, password } = sanitizedInput;

  // check if user already exists via email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    return res.status(400).send({
      message: 'Email already in use.',
    });
  }

  // create new user with hashed password
  const newUser = await User.create({ email, password });
  await newUser.hashPassword();
  /*
    try {
      await newUser.save();

      // create verification token for new user
      const verificationToken = TokenService.createToken();
      TokenService.setUserId(verificationToken, newUser._id);
      TokenService.saveToken(verificationToken);

      // send verification email to new user
      const verificationEmail = EmailService.createVerificationEmail(
        newUser.email,
        verificationToken.token
      );
      try {
        // attempt email service to registration email
        EmailService.sendEmail(verificationEmail);
        return res.status(200).send({
          message: `A verification email has been sent to ${verificationEmail}.`,
          newUser,
        });
      } catch (err) {
        //
        await User.findByIdAndDelete(user._id);

        return res.status(503).send({
          message: `Error sending an email to ${newUser.email}. You must re-register. Our service may be down.`,
        });
      }
    } catch (err) {
      LoggerService.log.error(err);

      return res
        .status(500)
        .send({ message: "Creation of user failed, try again." });
    }
  */
  await newUser.save();
  return res.status(201).send({
    newUser,
  });
};

export default {
  getUserById,
  deleteUserById,
  getAllUsers,
  createUserLocal,
  updateUserById,
  getCurrentUser,
  // postUser,
  // postUserCancel,
};
