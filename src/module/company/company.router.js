import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import { isAuthenticate } from "../../middlewares/authentication.js";
import { isAuthorize } from "../../middlewares/authorization.js";
import { catchError } from "../../middlewares/catchError.js";
import * as companySchema from "./company.schema.js";
import * as companyController from "./company.controller.js";
import jobRouter from "./../job/job.router.js";

const router = new Router();

router.use("/:companyId/job", jobRouter);

// &add
router.post(
  "/",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(companySchema.addShcema),
  catchError(companyController.addCompany)
);

// &update
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(companySchema.updateShcema),
  catchError(companyController.updateCompany)
);

// &delete
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(companySchema.companyIdSchema),
  catchError(companyController.deleteCompany)
);

// &get
router.get(
  "/companyData/:id",
  isAuthenticate,
  isAuthorize("Company_HR"),
  validation(companySchema.companyIdSchema),
  catchError(companyController.getCompanyData)
);

// &application
router.get(
  "/application",
  isAuthenticate,
  isAuthorize("Company_HR"),
  catchError(companyController.application)
);

// &searchByName
router.get(
  "/",
  isAuthenticate,
  isAuthorize("Company_HR", "User"),
  validation(companySchema.searchByName),
  catchError(companyController.searchByName)
);



export default router;
