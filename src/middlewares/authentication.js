import { catchError } from "./catchError.js";
import { tokenModel } from "../../DB/models/token.model.js";
import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/user.model.js";

export const isAuthenticate = catchError(async (req, res, next) => {
  //check token in headers
  let token = req.header("token");
  //check bearer key
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Invalid Token", { cause: 403 }));
  //split
  token = token.split(process.env.BEARER_KEY)[1];
  //check token & isValid in tokenModel
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  const tokenDB = await tokenModel.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Invalid Token, try to login again"));
  //payload send userData with req
  const user = await userModel.findById(payload.id);
  if (!user) return next(new Error("User not found", { cause: 404 }));
  //send data
  req.userData = user;
  //check isDeleted
  if (req.userData.isDeleted) return next(new Error("You need to login"));
  //next
  return next();
});
