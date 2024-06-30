import express from "express";
import Role from "../models/Role.js";

const router = express.Router();

router.post("/create", async (req, res, next) => {
  try {
    if (req.body.role && req.body.rode !== "") {
      const newRole = new Role(req.body);
      await newRole.save();
      return res.send("Role Created!");
    } else {
      return res.status(400).send("Bad Request");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error in Creating a Rolse");
  }
});

export default router;
