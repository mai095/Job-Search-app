import { tokenModel } from "../../../DB/models/token.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../utlis/email.validation.js";
import jwt from "jsonwebtoken";
import cloudinary from "../../../utlis/cloud.js";
import { signUpTemp } from "../../../utlis/htmlTemplete.js";

// ^register
export const register = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (user)
    return next(
      new Error("Dublicated data ,Email or Mobile number", { cause: 400 })
    );
  //hash pass
  const hashPass = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  const userName = req.body.firstName + " " + req.body.lastName;
  //check file in req and upload on cloudinary
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER}/user/profilePicture`,
      }
    );
    user.profilePic = {
      id: public_id,
      url: secure_url,
    };
  }
  //create user in db
  await userModel.create({ ...req.body, password: hashPass, userName });
  //create token to activation
  const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);
  //send email
  const html = signUpTemp(`http://localhost:5000/auth/activation/${token}`);
  const confirmMsg = await sendEmail({
    to: req.body.email,
    subject: "Activation",
    html,
  });
  //res
  if (!confirmMsg) return next(new Error("Invalid Email"));
  return res.json({
    success: true,
    message: "Check your Email to Activation",
  });
};

// ^activation
export const activation = async (req, res, next) => {
  //check token
  const { token } = req.params;
  if (!token) return next(new Error("Invalid Url"), { cause: 400 });
  //decode token and update user
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  await userModel.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );
  //res
  return res.json({
    success: true,
    message: "You can login now",
  });
};

// ^login
export const login = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (!user)
    return next(new Error("This Email not found ,please signUp first!"));
  //check isConfirmed
  if (!user.isConfirmed) next(new Error("This account need to be activated"));
  //check pass  == pass in db
  if (!bcrypt.compareSync(req.body.password, user.password))
    return next(new Error("Wrong Password!"));
  //generate token in token model
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET_KEY
  );
  await tokenModel.create({
    token,
    agent: req.header["agent"],
    user: user._id,
  });
  //isDeleted =false
  user.isDeleted = false;
  user.status = "online";
  await user.save();
  //res
  return res.json({
    success: true,
    token: token,
  });
};
