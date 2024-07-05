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

const generateReceiptNumber = () => {
  return `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const createReceipt = async (req, res, next) => {
  try {
    const { userId, productList } = req.body;

    // Calculate total price and prepare product details for email
    let emailBody = `Dear Customer,\n\n`;
    emailBody += `Your receipt with number ${generateReceiptNumber()} has been created successfully.\n\n`;
    emailBody += `Details:\n`;
    emailBody += `----------------------------------\n`;

    let totalPrice = 0;

    productList.forEach((product, index) => {
      const itemPrice = product.price * product.quantity;
      totalPrice += itemPrice;
      emailBody += `${index + 1}. ${product.name} - Quantity: ${
        product.quantity
      }, Price: $${product.price.toFixed(2)}, Total: $${itemPrice.toFixed(
        2
      )}\n`;
    });

    const tax = totalPrice * 0.18;
    totalPrice += tax;

    emailBody += `----------------------------------\n\n`;
    emailBody += `Total Price (including tax): $${totalPrice.toFixed(2)}\n\n`;
    emailBody += `Thank you for your purchase!\n\n`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "maamounchebbi@gmail.com", // Replace with a dynamic recipient email address
      subject: "Receipt Created Successfully",
      text: emailBody,
    };

    const receipt = new Receipt({
      userId,
      productList,
      totalPrice,
      tax,
      receiptNumber: generateReceiptNumber(),
    });

    const newReceipt = await receipt.save();

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Receipt Created Successfully!",
      receipt: newReceipt,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Bad Request for Creating Receipt!",
    });
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
