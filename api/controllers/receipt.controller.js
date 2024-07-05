import Receipt from "../models/Receipt.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

import { sendEmail } from "../utils/mailer.js";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Function to generate a unique receipt number
const generateReceiptNumber = () => {
  return `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Utility function to format product list for email
const formatProductList = (products) => {
  return products
    .map((product, index) => {
      return `${product.productId.productName} - ${product.quantity} : ${product.productId.productPrice}`;
    })
    .join("\n");
};

// Create a new receipt based on cartId
export const createReceipt = async (req, res, next) => {
  try {
    const { cartId } = req.body;

    // Find the cart based on cartId and populate products with productId, productName, productPrice
    const cart = await Cart.findById(cartId).populate({
      path: "products.productId",
      select: "productName productPrice",
    });

    // Handle case where cart is not found
    if (!cart) {
      return next(CreateError(404, "Cart not found"));
    }

    // Ensure cart.products is not null or undefined
    if (!cart.products || cart.products.length === 0) {
      return next(CreateError(400, "Cart products not found or empty"));
    }

    // Calculate total price and tax
    const totalPrice = cart.products.reduce((total, product) => {
      // Ensure product and productId exist before accessing productPrice
      if (product.productId && product.productId.productPrice) {
        return total + product.quantity * product.productId.productPrice;
      }
      return total; // Return total unchanged if product or productPrice is null
    }, 0);

    const tax = totalPrice * 0.18; // Assuming tax calculation based on totalPrice

    // Create a new receipt
    const newReceipt = new Receipt({
      userId: cart.userId,
      productList: cart.products
        .filter((item) => item.productId && item.productId._id)
        .map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.productPrice || 0,
        })),
      totalPrice,
      tax,
      receiptNumber: generateReceiptNumber(),
    });

    // Save the receipt
    await newReceipt.save();

    // Fetch user details based on userId from the receipt
    const user = await User.findById(cart.userId);

    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    // Prepare email content
    const emailSubject = `Receipt Number: ${newReceipt.receiptNumber}`;
    const emailText = `Dear ${user.firstName} ${
      user.lastName
    },\n\nYour receipt with number ${
      newReceipt.receiptNumber
    } has been created successfully.\n\nBelow are the details:\n\n${formatProductList(
      cart.products
    )}\nTotal Price: ${totalPrice.toFixed(
      2
    )}\n\nThank you for choosing our services.\n\nRegards,\nBuyMe`;

    // Send email to user
    await sendEmail(user.email, emailSubject, emailText);

    // Prepare email content for seller notification
    const sellerEmailSubject = `New Purchase: Receipt Number ${newReceipt.receiptNumber}`;
    const sellerEmailText = `Dear BuyMe,\n\n${user.firstName} ${
      user.lastName
    } has made a purchase.\n\nReceipt Number: ${
      newReceipt.receiptNumber
    }\n\nBelow are the details:\n\n${formatProductList(
      cart.products
    )}\n\nTotal Price: ${totalPrice.toFixed(
      2
    )}\n\nThank you for your prompt attention.\n\nRegards,\nBuyMe`;

    // Send email to seller
    await sendEmail(
      process.env.GMAIL_USER,
      sellerEmailSubject,
      sellerEmailText
    );

    // Clear the cart after creating the receipt
    // cart.products = [];
    // await cart.save();

    // Return success response
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
