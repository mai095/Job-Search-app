import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authentication.js";
import { isAuthorize } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import { catchError } from "../../middlewares/catchError.js";
import * as jobSchema from "./job.schema.js";
import * as jobController from "./job.controller.js";
import { fileUpload, filterValidation } from "../../../utlis/fileUpload.js";

const router = new Router({ mergeParams: true });

// &add
router.post(
  "/",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(jobSchema.jobSchema),
  catchError(jobController.addJob)
);

// &update
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(jobSchema.updateSchema),
  catchError(jobController.updateJob)
);

// &delete
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(jobSchema.jobIdSchema),
  catchError(jobController.deleteJob)
);

// &get all job with company data
router.get(
  "/jobWithData",
  isAuthenticate,
  isAuthorize("Company_HR", "User"),
  catchError(jobController.jobWithData)
);

// &Get all Jobs for a specific company.
router.get(
  "/jobWithSpecificCompany",
  isAuthenticate,
  isAuthorize("Company_HR", "User"),
  validation(jobSchema.companyNameSchema),
  catchError(jobController.jobWithSpecificCompany)
);

// &filter
router.get(
  "/filterJob",
  isAuthenticate,
  isAuthorize("Company_HR", "User"),
  validation(jobSchema.filterJobSchema),
  catchError(jobController.filterJob)
);

// &applyJob
router.post(
  "/applyJob/:jobId",
  isAuthenticate,
  isAuthorize("User"),
  fileUpload({ filter: filterValidation.files }).single('applicationPDF'),
  validation(jobSchema.applyJobSchema),
  catchError(jobController.applyJob)
);

router.get(
  "/applications/:companyId",
  isAuthenticate,
  isAuthorize("User"),
  // validation(jobSchema.applyJobSchema),
  catchError(jobController.applications)
);
export default router;
