import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

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
