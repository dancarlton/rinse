import { model, Schema } from "mongoose";
import { omit } from "ramda";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
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
  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["admin", "user", "provider"],
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

userSchema.plugin(mongooseUniqueValidator);

export const User = model("User", userSchema);

export default User;
