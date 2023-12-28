import { model, Schema } from 'mongoose';
import { omit } from 'ramda';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import mongooseUniqueValidator from 'mongoose-unique-validator';

// ! Change schema for additional location fields
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 50,
      unique: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: dayjs().toDate() },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
      enum: ['admin', 'user', 'provider'],
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: false,
    },
    services: [
      {
        name: { type: String, required: true, default: '' },
        description: { type: String, required: true, default: '' },
        price: { type: Number, required: true, default: 0 },
        estimatedTime: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 },
        photo: { type: String, required: false, default: '' },
      },
    ],
    reviews: [
      {
        name: { type: String, required: false },
        avatar: { type: String, default: '/images/icons/default-avatar.jpg' },
        rating: { type: Number, required: false },
        comment: { type: String, required: false },
      },
    ],
    // ! added locations for testing sample user locations
    locations: {
      latitude: { type: String, required: false },
      longitude: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function hashPassword() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err1, salt) => {
      if (err1) {
        reject(err1);
        return;
      }
      bcrypt.hash(this.password, salt, (err2, hash) => {
        if (err2) {
          reject(err2);
          return;
        }
        this.password = hash;
        resolve(hash);
      });
    });
  });
};

userSchema.methods.hidePassword = function hidePassword() {
  return omit(['password', '__v'], this.toObject({ virtuals: true }));
};

userSchema.plugin(mongooseUniqueValidator);

export const User = model('User', userSchema);

export default User;
