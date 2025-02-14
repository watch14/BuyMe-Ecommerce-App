import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";
import UserToken from "../models/UserToken.js";

import nodemailer from "nodemailer";

//register user / create an account
export const register = async (req, res, next) => {
  try {
    // Find role "User" in the roles collection
    const role = await Role.findOne({ role: "User" });

    if (!role) {
      return next(CreateError(404, "User role not found"));
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user instance
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      roles: [role._id], // Assuming roles is an array of ObjectId
    });

    // Save new user to the database
    await newUser.save();

    return next(CreateSuccess(200, "User Registered Successfully!"));
    //
  } catch (error) {
    return next(CreateError(500, "Internal server error for creating a user"));
  }
};

//register Admin / create an account as Admin
export const registerAdmin = async (req, res, next) => {
  try {
    // Find role "User" in the roles collection
    const role = await Role.find({});

    if (!role) {
      return next(CreateError(404, "There is no role"));
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user instance
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      isAdmin: true,
      roles: role,
    });

    // Save new user to the database
    await newUser.save();

    return next(CreateSuccess(200, "Admin Registered Successfully!"));
    //
  } catch (error) {
    return next(
      CreateError(500, "Internal server error for creating an Admin")
    );
  }
};

//login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );
    const { roles } = user;
    if (!user) {
      return next(CreateError(404, "User Email Not found!"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(CreateError(400, "Wrong Password!"));
    }
    // Session TOKEN //////////////////////////////////////////////////////
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        roles: roles,
      },
      process.env.JWT_SECRET
    );
    console.log("Login successful for email:", req.body.email);
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: 200,
      message: "login Success!",
      data: user,
    });

    // return next(CreateSuccess(200, "login Success!"));
  } catch (error) {
    console.error("Login Went Wrong:", error);
    return next(CreateError(400, "Login Went Wrong!"));
  }
};

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: { $regex: new RegExp("^" + email, "i") },
  });

  if (!user) {
    return next(CreateError(404, "User not found to rest Password!!"));
  }
  const payload = {
    email: user.email,
  };

  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });

  const newToken = new UserToken({
    userId: user._id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maamounchebbi@gmail.com",
      pass: process.env.GMAIL_PASS2,
    },
  });

  let mailDetails = {
    from: "maamounchebbi@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `
    <html> <head> <title>Password Reset Request</title>
     </head> 
     <body>
      I <h1>Password Reset Request</h1> <p>Dear ${user.firstName},</p> 
     <p>We have received a request to reset your password for your account with BookMYBook. To complete the password 
     reset process, please click on the button below:</p>
      <a href=${process.env.LIVE_URL}/reset/${token}>
      <button style="background-color: #4CAF50; color: white;
       padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">
       Reset Password</button></a> <p>Please note that this link is only valid for a 5mins.
        If you did not request a password reset, please disregard this message.</p>
        <p>Thank you,</p> <p>Let's Program Team</p> 
         </body> 
         </html>
    `,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      return next(
        CreateError(500, "Something went wrong while sending the email!")
      );
    } else {
      await newToken.save();
      return next(CreateSuccess(200, "Email Sent Successfully!"));
    }
  });
};

export const resetPassword = async (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(CreateError(500, "Reset Link is Expired!"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: new RegExp("^" + response.email, "i") },
      });

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptedPassword;

      try {
        const updateUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        return next(CreateSuccess(200, "Password Reset Succsess!"));
      } catch (error) {
        return next(
          CreateError(500, "Something went wrong while resetting the password")
        );
      }
    }
  });
};
