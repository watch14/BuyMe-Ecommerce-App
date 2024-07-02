import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateSuccess } from "../utils/success.js";

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

//login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
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
    return next(CreateSuccess(200, "login Success!"));
  } catch (error) {
    return next(CreateError(400, "Login Went Wrong!"));
  }
};

//update user by ID
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (user) {
      const newData = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(CreateSuccess(200, "User Updated!"));
    } else {
      return next(CreateError(404, "User Not Found!"));
    }
  } catch (error) {
    return next(CreateError(500, "Internal Server Error for Updating a User!"));
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return next(CreateSuccess(200, "Users Retrieved Successfully!", users));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error for fetching users"));
  }
};

//delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    // If user exists, delete it
    await User.findByIdAndDelete(userId);

    return next(CreateSuccess(200, "User deleted successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal server error for deleting a user"));
  }
};
