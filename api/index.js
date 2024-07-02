import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import roleRoute from "./routes/role.js";
import authRouter from "./routes/auth.js";

const app = express();
const port = 3000;
//dotenv secure mongodb link
dotenv.config();

//to accept JSON format
app.use(express.json());

app.use("/api/role", roleRoute);
app.use("/api/auth", authRouter);

//response handler
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const message = obj.message || "Somethong went wrong!";
  return res.status(statusCode).json({
    success: [200, 201, 204].some((x) => x === obj.status) ? true : false,
    status: statusCode,
    message: message,
    data: obj.data,
  });
});

//DB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conncted to MongoDB!");
  } catch (error) {
    throw error;
  }
};

app.listen(port, async () => {
  try {
    await connectMongoDB();
    console.log(`App Connected to Back-end on port: ${port}

          http://localhost:${port}/`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
});
