import joi from "joi";

// *registerSchema
export const registerSchema = joi
  .object({
    firstName: joi.string().required().min(3).max(20),
    lastName: joi.string().required().min(3).max(20),
    userName: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
    recoveryEmail: joi.string().email().required(),
    DOB: joi.date(),
    mobileNumber: joi.string(),
    role: joi.string(),
  })
  .required();

// *loginSchema
export const loginSchema = joi
  .object({
    email: joi.string().email(),
    mobileNumber: joi.string(),
    password: joi.string().required(),
  })
  .required();

