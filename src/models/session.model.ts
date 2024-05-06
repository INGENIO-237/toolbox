import { Schema, Types, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends Document {
  user: UserDocument["_id"];
  isValid: boolean;
  ip: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Session = model<SessionDocument>("Session", sessionSchema);

export default Session;
