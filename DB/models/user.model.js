import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 10,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 10,
    },
    userName: {
      type: String,
    },

    
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
     mobileNumber: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    DOB: {
      type: Date,
    },
   
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    profilePic: {
      id: {
        type: String,
        default:
          "job%20search%20app/users/profilePic/default%20picture/simple-user-default-icon-free-png_mo3d9o",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dmq2km3vq/image/upload/v1706350540/job%20search%20app/users/profilePic/default%20picture/simple-user-default-icon-free-png_mo3d9o.webp",
      },
    },
    coverPics: [
      {
        id: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const userModel = model("User", userSchema);
