import joi from "joi";
import { validObjectId } from "../../middlewares/validation.js";

// *addSchema
export const addShcema = joi
  .object({
    companyName: joi.string().required(),
    desc: joi.string().min(5).max(200),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string().required(),
  })
  .required();

// *updateShcema
export const updateShcema = joi
  .object({
    id: joi.string().required().custom(validObjectId),
    companyName: joi.string(),
    desc: joi.string().min(5).max(200),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string(),
  })
  .required();

// *companyIdSchema
export const companyIdSchema = joi
  .object({
    id: joi.string().required().custom(validObjectId),
  })
  .required();

// *searchByName
export const searchByName = joi
  .object({
    companyName: joi.string(),
  })
  .required();
