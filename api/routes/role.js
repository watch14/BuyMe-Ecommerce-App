import express from "express";
import Role from "../models/Role.js";
import {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
} from "../controllers/role.controller.js";

const router = express.Router();

//Create Role in DB
router.post("/create", createRole);

//Update a Role by ID
router.put("/update/:id", updateRole);

//Get All Roles
router.get("/roles", getAllRoles);

//Delet role By ID
router.delete("/delete/:id", deleteRole);

export default router;
