import Role from "../models/Role.js";
import User from "../models/User.js";

//register user / create an account
export const register = async (req, res, next) => {
  const role = await Role.find({ role: "User" });
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    roles: role,
  });
  await newUser.save();
  return res.status(200).send("User Registered / Created!");
};
