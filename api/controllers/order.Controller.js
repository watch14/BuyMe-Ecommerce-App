import Order from "../models/Order.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Create Order
export const createOrder = async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    return next(CreateSuccess(200, "Order Created Successfully!"));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Creating an Order!")
    );
  }
};

// Update Order by ID
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById({ _id: req.params.id });
    if (order) {
      await Order.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(CreateSuccess(200, "Order Updated Successfully!"));
    } else {
      return next(CreateError(404, "Order Not Found!"));
    }
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Updating an Order!")
    );
  }
};

// Get All Orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId products.productId");
    return next(CreateSuccess(200, "Orders Retrieved Successfully!", orders));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Fetching All Orders")
    );
  }
};

// Get Order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId products.productId"
    );
    if (!order) {
      return next(CreateError(404, "Order Not Found!"));
    }
    return next(CreateSuccess(200, "Order Retrieved Successfully!", order));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Fetching Order by ID")
    );
  }
};

// Delete Order by ID
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(CreateError(404, "Order Not Found!"));
    }
    await Order.findByIdAndDelete(req.params.id);
    return next(CreateSuccess(200, "Order Deleted Successfully!"));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Deleting an Order!")
    );
  }
};
