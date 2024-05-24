import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: ["onSite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["junior", "mid-level", "senior", "team-lead", "cto"],
      required: true,
    },
    jobDescription: {
      type: String,
      min: 5,
      max: 200,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
    strictQuery:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual("application", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

export const jobModel = model("Job", jobSchema);
