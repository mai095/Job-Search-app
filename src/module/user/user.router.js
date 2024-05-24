import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import { isAuthenticate } from "../../middlewares/authentication.js";
import { catchError } from "../../middlewares/catchError.js";
import * as userSchema from "./user.schema.js";
import * as userController from "./user.controller.js";

const router = new Router();
// &update
router.patch(
  "/update/:id",
  isAuthenticate,
  validation(userSchema.updateSchema),
  catchError(userController.updateAccount)
);
// &delete
router.delete(
  "/delete/:id",
  isAuthenticate,
  validation(userSchema.userIdSchema),
  catchError(userController.deleteAccount)
);

//  &get
router.get(
  "/getUserData/:id",
  isAuthenticate,
  validation(userSchema.userIdSchema),
  catchError(userController.getUserData)
);

// &getdata
router.get(
  "/getData/:id",
  isAuthenticate,
  validation(userSchema.userIdSchema),
  catchError(userController.getData)
);

// &updatePass
router.put(
  "/updatePass",
  isAuthenticate,
  validation(userSchema.updatePassSchema),
  catchError(userController.updatePass)
);

//&forget Password
//*1-generateCode
router.patch(
  "/",
  validation(userSchema.userEmailSchema),
  catchError(userController.generateCode)
);
//*2-resetPassword
router.patch(
  "/resetPassword",
  validation(userSchema.resetPassSchema),
  catchError(userController.resetPassword)
);

// &accountRecoveryEmail
router.get(
  "/accountRecoveryEmail",
  isAuthenticate,
  validation(userSchema.recoveryEmailSchema),
  catchError(userController.accountRecoveryEmail)
);

export default router;
