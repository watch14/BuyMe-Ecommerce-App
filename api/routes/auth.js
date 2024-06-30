import express from "express";
import {
  deleteUser,
  getAllUsers,
  login,
  register,
  updateUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

//register
router.post("/register", register);

//login
router.post("/login", login);

//update user
router.put("/update/:id", updateUser);

// Get all users
router.get("/users", getAllUsers);

// Delete a user by ID
router.delete("/delete/:id", deleteUser);

export default router;
