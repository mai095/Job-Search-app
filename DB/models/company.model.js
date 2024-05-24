import { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      lowercase: true,
    },
    desc: {
      type: String,
      min: 5,
      max: 200,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
      min: 11,
      max: 20,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    companyHR: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//virtual populate
companySchema.virtual("job", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

export const companyModel = model("Company", companySchema);
