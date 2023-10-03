import { model, Schema } from "mongoose";
import { omit } from "ramda";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50,
  },
  googleId: {
    type: String,
    required: false,
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
    minlength: 5,
    maxlength: 1024,
  },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: dayjs().toDate() },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  expires: { type: Date, default: dayjs().toDate(), expires: 43200 },
});

userSchema.methods.comparePassword = function comparePassword(password) {
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
  return omit(["password", "__v", "_id"], this.toObject({ virtuals: true }));
};

export const User = model("User", userSchema);

export default User;
