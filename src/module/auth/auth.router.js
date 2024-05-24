import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import * as authSchema from "./auth.schema.js";
import { catchError } from "../../middlewares/catchError.js";
import * as authController from "./auth.controller.js";
import { fileUpload, filterValidation } from "../../../utlis/fileUpload.js";

const router = new Router();

// &register
router.post(
  "/register",
  fileUpload({
    filter: filterValidation.images,
  }).single("pp"),
  // validation(authSchema.registerSchema),
  catchError(authController.register)
);

// &activation
router.get("/activation/:token", catchError(authController.activation));

// &login
router.post(
  "/login",
  validation(authSchema.loginSchema),
  catchError(authController.login)
);

export default router;
