import { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userTechSkills: [{ type: String, required: true }],
    userSoftSkills: [{ type: String, required: true }],
    userResume: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const appModel = model("Application", applicationSchema);
