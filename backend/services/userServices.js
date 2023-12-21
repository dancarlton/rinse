import dayjs from 'dayjs';
import { User } from '../models/userModel.js';

export const getUser = (user) => user.hidePassword();

export const createUser = ({ username, email, password }) =>
  new User({ username, email, password });

export const setResetPasswordToken = (user, resetTokenValue, expiryDate) => {
  user.passwordResetToken = resetTokenValue;
  user.passwordResetExpires = expiryDate;
};

export const findUserBy = async (prop, value) => await User.findOne({ [prop]: value });

export const findUserById = async (id) => await User.findById(id);

export const saveUser = async (user) => await user.save();

export const setUserPassword = async (user, password) => {
  user.password = password;
  user.passwordResetToken = '';
  user.passwordResetExpires = dayjs().toDate();
  return await user.hashPassword();
};

export const setUserVerified = async (user) => {
  user.isVerified = true;
  user.expires = undefined;
};

export const deleteUserById = async (user) => await User.findByIdAndDelete(user._id);

export const deleteUnverifiedUserByEmail = async (email) =>
  await User.findOneAndDelete({ email, isVerified: false });

export default {
  getUser,
  createUser,
  setResetPasswordToken,
  findUserBy,
  findUserById,
  saveUser,
  setUserPassword,
  setUserVerified,
  deleteUserById,
  deleteUnverifiedUserByEmail,
};
