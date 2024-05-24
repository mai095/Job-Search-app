import joi from "joi";
import { validObjectId } from "../../middlewares/validation.js";

//   *updateSchema
export const updateSchema = joi
  .object({
    id: joi.string().required().custom(validObjectId),
    email: joi.string().email(),
    mobileNumber: joi.string(),
    recoveryEmail: joi.string().email(),
    DOB: joi.date(),
    firstName: joi.string().min(3).max(20),
    lastName: joi.string().min(3).max(20),
  })
  .required();

//   *userIdSchema
export const userIdSchema = joi
  .object({
    id: joi.string().required().custom(validObjectId),
  })
  .required();

//   *userEmailSchema
export const userEmailSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// *resetPassSchema
export const resetPassSchema = joi
  .object({
    email: joi.string().email().required(),
    forgetCode: joi.number().required(),
    newPassword: joi.string().required(),
  })
  .required();

// *updatePassSchema
export const updatePassSchema = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().required().valid(joi.ref("newPassword")),
  })
  .required();

// *recoveryEmailSchema
export const recoveryEmailSchema = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();
