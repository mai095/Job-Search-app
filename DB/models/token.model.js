import { Schema, Types, model } from "mongoose";

export const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    agent: {
      type: String,
    },
    expiredAt: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const tokenModel = model("Token", tokenSchema);
