import express from "express";
import mongoose from "mongoose";

//dotenv secure mongodb link
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

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
