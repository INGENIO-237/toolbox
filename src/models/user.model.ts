import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";


export interface UserDocument extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  otp: number;
  hasBeenDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    hasBeenDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.SALT_FACTOR);

  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  const user = this as UserDocument;

  return await bcrypt
    .compare(candidate.trim(), user.password)
    .catch((e) => false);
};

const User = model<UserDocument>("User", userSchema);

export default User;
