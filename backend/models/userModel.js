import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcryptjs';
import mongooseUniqueValidator from 'mongoose-unique-validator';

// Define a Point schema for GeoJSON format
const PointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // format will be [longitude, latitude]
      required: true,
    },
  },
  {
    _id: false, // Disable _id for subdocument
  }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 2,
      maxlength: 50,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user', 'provider'],
    },
    avatar: {
      type: String,
      default: '',
    },
    numRatings: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: PointSchema,
      required: false,
      index: '2dsphere', // Enables geospatial queries
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongooseUniqueValidator);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Updates the rating of the user based on a new rating input.
 *
 * @param {number} newRating - The new rating to be added.
 * @return {Promise} A promise that resolves to the updated user object after saving.
 */
userSchema.methods.updateRating = function updateRating(newRating) {
  const cumulativeRatingScore = numRatings * rating + newRating;
  this.numRatings += 1;
  this.rating = cumulativeRatingScore / this.numRatings;
  return this.save();
};

/**
 * Compares the provided password with the stored password for the user.
 *
 * @param {string} candidatePassword - The password to compare with the stored password
 * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the passwords match
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Hides sensitive information from the user object, such as the password.
 *
 * @return {Object} The user object without the password field.
 */
userSchema.methods.hidePassword = function hidePassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model('User', userSchema);
