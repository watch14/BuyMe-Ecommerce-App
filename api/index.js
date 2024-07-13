import express from "express";
import mongoose, { version } from "mongoose";
import dotenv from "dotenv";

import roleRoute from "./routes/role.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import CategoryRouter from "./routes/category.js";
import PromocodeRouter from "./routes/promocode.js";
import CartartRouter from "./routes/cart.js";

import cors from "cors";

import ProductRouter from "./routes/products.js";
import favoriteRoutes from "./routes/favorites.js";
import sortRoutes from "./routes/sort.js";
import receiptRoutes from "./routes/receipt.js";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

import Stripe from "stripe";
import paymentRouter from "./routes/payment.js";

const app = express();
const port = 3000;
const allowedOrigins = ["http://localhost:4200", "http://localhost:5000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin, like mobile apps or curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Auth",
      version: "1.0.0",
      description: "User Authentification",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// dotenv secure mongodb link
dotenv.config();

//stripe payment online
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// to accept JSON format
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use("/api/role", roleRoute);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/promo-code", PromocodeRouter);
app.use("/api/cart", CartartRouter);

app.use("/api/product", ProductRouter);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/sort", sortRoutes);
app.use("/api/receipts", receiptRoutes);

app.use("/api/payment", paymentRouter);

// Response handler
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

// DB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_ONLINE);
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
