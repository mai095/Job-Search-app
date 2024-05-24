import { tokenModel } from "../../../DB/models/token.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import cloudinary from "../../../utlis/cloud.js";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import { sendEmail } from "../../../utlis/email.validation.js";
import { resetPassTemp } from "../../../utlis/htmlTemplete.js";

// ^update account
export const updateAccount = async (req, res, next) => {
  // check user
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  //check owner
  if (user._id.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this account", { cause: 403 })
    );

  //check email and mobile in DB
  const dublicate = await userModel.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (dublicate) return next(new Error("Dublicated Data", { cause: 400 }));

  //update
  user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
  user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
  const userName = req.body.firstName + " " + req.body.lastName;

  await userModel.findByIdAndUpdate(
    user._id,
    { ...req.body, userName },
    { new: true }
  );

  //logout
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //res
  return res.json({
    success: true,
    message: "User updated successfully!, try to login again",
  });
};

// ^delete
export const deleteAccount = async (req, res, next) => {
  // check user
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new Error("User not Found", { cause: 404 }));
  //check owner
  if (user._id.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to delete this account", { cause: 403 })
    );
  //destroy token
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //delete
  await userModel.findByIdAndDelete(user._id);
  //delete image from cloudinary
  await cloudinary.uploader.destroy({ public_id: user.profilePic.id });
  //res
  return res.json({
    success: true,
    message: "user deleted successfully!",
  });
};

// ^get
export const getUserData = async (req, res, next) => {
  // check user
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new Error("User not Found", { cause: 404 }));
  //check owner
  if (user._id.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to get data of this account", { cause: 403 })
    );
  // get data
  const results = await userModel.findById(user._id);
  return res.json({
    success: true,
    results,
  });
};

// ^data of another user
export const getData = async (req, res, next) => {
  const { id } = req.params;
  // get data
  const results = await userModel.findById(id);
  return res.json({
    success: true,
    results,
  });
};

// ^UpdatePassword
export const updatePass = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.userData.email });
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  //check oldPass==userPass
  if (!bcrypt.compareSync(req.body.oldPassword, user.password))
    return next(
      new Error("Wrong Password,you not allowed to change password", {
        cause: 403,
      })
    );
  //hash newPass
  const hashPass = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  //update DB &save
  user.password = hashPass;
  await user.save();

  //logOut
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  
  //res
  return res.json({
    success: true,
    message:
      "Account password updated successfully, try to login again with new password",
  });
};

// ^Forget password
//*1-generateCode
export const generateCode = async (req, res, next) => {
  //check email &isConfirmed
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found", { casue: 404 }));
  if (!user.isConfirmed)
    return next(new Error("Activate your account first!", { casue: 400 }));

  //generate code
  user.forgetCode = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  //update forgetCode & save DB
  await user.save();

  //send email
  const html = resetPassTemp(user.forgetCode);
  sendEmail({
    to: user.email,
    subject: "Forget Code",
    html,
  });

  //res
  return res.json({
    success: true,
    message: "Ckeck your Email",
  });
};

//*2-resetPassword
export const resetPassword = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found", { casue: 404 }));

  //check forgetCode
  if (user.forgetCode !== req.body.forgetCode)
    return next(new Error("Invalid Code", { casue: 400 }));
  //update forgetCode
  await userModel.findByIdAndUpdate(
    user._id,
    { $unset: { forgetCode: 1 } },
    { new: true }
  );

  //hash pass
  const hashPass = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  //update & save DB
  user.password = hashPass;
  await user.save();

  //logOut
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //res
  return res.json({
    success: true,
    message: "Password reset successfully, you can login with new password",
  });
};

// ^account with recovery Email
export const accountRecoveryEmail = async (req, res, next) => {
  //check recoveryEmail
  const accounts = await userModel
    .find({
      recoveryEmail: req.body.recoveryEmail,
    })
    .select({ email: 1, _id: 0 });

  if (accounts.length == 0)
    return next(new Error("Recovery Email not found", { casue: 404 }));
  //res
  return res.json({
    success: true,
    accounts,
  });
};
