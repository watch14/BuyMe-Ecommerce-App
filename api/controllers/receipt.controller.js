import Receipt from "../models/Receipt.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Generate a unique receipt number
const generateReceiptNumber = () => {
  return `RCPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create a new receipt
export const createReceipt = async (req, res, next) => {
  try {
    const { userId, productList } = req.body;

    // Calculate total price
    const totalPrice = productList.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    const receipt = new Receipt({
      userId,
      productList,
      totalPrice,
      tax: totalPrice * 0.18,
      receiptNumber: generateReceiptNumber(),
    });

    const newReceipt = await receipt.save();
    return next(CreateSuccess(201, "Receipt Created Successfully!", newReceipt));
  } catch (error) {
    console.error(error);
    return next(CreateError(400, "Bad Request for Creating Receipt!"));
  }
};

// Get all receipts
export const getAllReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find().populate("userId").populate("productList.productId");
    return next(CreateSuccess(200, "Receipts Retrieved Successfully!", receipts));
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for fetching receipts"));
  }
};

// Get receipt by ID
export const getReceiptById = async (req, res, next) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Receipt.findById(receiptId).populate("userId").populate("productList.productId");

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

    return next(CreateSuccess(200, "Receipt Updated Successfully!", updatedReceipt));
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
