import Receipt from "../models/Receipt.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Generate a unique receipt number
const generateReceiptNumber = () => {
  return `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create a new receipt based on cartId
export const createReceipt = async (req, res, next) => {
  try {
    const { cartId } = req.body;

    // Find the cart based on cartId
    const cart = await Cart.findById(cartId).populate({
      path: "products.productId",
      select: "productName productPrice",
    });

    if (!cart) {
      return next(CreateError(404, "Cart not found"));
    }

    // Calculate total price and tax
    const totalPrice = cart.products.reduce((total, product) => {
      return total + product.quantity * product.productId.productPrice;
    }, 0);

    const tax = totalPrice * 0.18; // Assuming tax calculation based on totalPrice

    // Create a new receipt
    const newReceipt = new Receipt({
      userId: cart.userId,
      productList: cart.products.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.productPrice,
      })),
      totalPrice,
      tax,
      receiptNumber: generateReceiptNumber(),
    });

    // Save the receipt
    await newReceipt.save();

    // Clear the cart after creating the receipt
    //cart.products = [];
    //await cart.save();

    return next(
      CreateSuccess(200, "Receipt Created Successfully!", newReceipt)
    );
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for creating receipt"));
  }
};

// Get all receipts
export const getAllReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find()
      .populate("userId")
      .populate("productList.productId");
    return next(
      CreateSuccess(200, "Receipts Retrieved Successfully!", receipts)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching receipts")
    );
  }
};

// Get receipt by ID
export const getReceiptById = async (req, res, next) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Receipt.findById(receiptId)
      .populate("userId")
      .populate("productList.productId");

    if (!receipt) {
      return next(CreateError(404, "Receipt not found"));
    }

    return next(CreateSuccess(200, "Receipt Retrieved Successfully!", receipt));
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for fetching receipt"));
  }
};

// Update receipt by ID
export const updateReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;
    const { productList } = req.body;

    const totalPrice = productList.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptId,
      { $set: { productList, totalPrice, tax: totalPrice * 0.18 } },
      { new: true }
    );

    if (!updatedReceipt) {
      return next(CreateError(404, "Receipt not found"));
    }

    return next(
      CreateSuccess(200, "Receipt Updated Successfully!", updatedReceipt)
    );
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for updating receipt"));
  }
};

// Delete receipt by ID
export const deleteReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;

    const deletedReceipt = await Receipt.findByIdAndDelete(receiptId);
    if (!deletedReceipt) {
      return next(CreateError(404, "Receipt not found"));
    }

    return next(CreateSuccess(200, "Receipt Deleted Successfully!"));
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for deleting receipt"));
  }
};
