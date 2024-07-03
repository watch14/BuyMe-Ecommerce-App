//update user by ID
import User from "../models/User.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return next(CreateSuccess(200, "Users Retrieved Successfully!", users));
  } catch (error) {
    console.error("errr:", error);

    return next(
      CreateError(500, "Internal Server Error for fetching all users")
    );
  }
};

// Get user by id
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    return next(CreateSuccess(200, "User Retrieved Successfully!", user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return next(CreateError(500, "Internal Server Error for fetching user"));
  }
};

// Update user by ID
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(CreateError(404, "User Not Found!"));
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    return next(CreateSuccess(200, "User Updated!", userData));
  } catch (error) {
    console.error("Error updating user:", error);
    return next(CreateError(500, "Internal Server Error for Updating a User!"));
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
