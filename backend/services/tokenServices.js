import crypto from 'crypto';
import Token from '../models/tokenModel.js';

export const createToken = () =>
  new Token({
    token: crypto.randomBytes(16).toString('hex'),
  });

export const findTokenBy = async (prop, value) => await Token.findOne({ [prop]: value });

export const setUserId = (token, userId) => {
  token._userId = userId;
};

export const saveToken = (token) => token.save();

export default {
  createToken,
  findTokenBy,
  setUserId,
  saveToken,
};
