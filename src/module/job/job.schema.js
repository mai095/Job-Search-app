import joi from "joi";
import { validObjectId } from "../../middlewares/validation.js";

// *jobSchema
export const jobSchema = joi
  .object({
    companyId: joi.string().custom(validObjectId).required(),
    jobTitle: joi.string().required().min(3).max(20),
    jobLocation: joi.string().required(),
    workingTime: joi.string().required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string().required().min(5).max(200),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
  })
  .required();

// *updateSchema
export const updateSchema = joi
  .object({
    id: joi.custom(validObjectId),
    jobTitle: joi.string().min(3).max(20),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string().min(5).max(200),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();

// *jobIdSchema
export const jobIdSchema = joi
  .object({
    id: joi.custom(validObjectId),
  })
  .required();

// *companyNameSchema
export const companyNameSchema = joi
  .object({
    companyName: joi.string().required(),
  })
  .required();

// *filterJobSchema
export const filterJobSchema = joi
  .object({
    // workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
    jobTitle: joi.string().min(3).max(20),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
  })
  .required();

// *applyJobSchema
export const applyJobSchema = joi
  .object({
    jobId: joi.string().required(),
    userTechSkills: joi.array().items(joi.string()).required(),
    userSoftSkills: joi.array().items(joi.string()).required(),
  })
  .required();
