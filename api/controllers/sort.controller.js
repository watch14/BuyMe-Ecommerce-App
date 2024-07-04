import Product from "../models/Product.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Get All Products with optional sorting and filtering
export const getAllProducts = async (req, res, next) => {
  try {
    const sortBy = req.query.sortBy || "productName";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const category = req.query.category;

    let query = {};
    if (category) {
      query.categoryId = category;
    }

    const products = await Product.find(query).sort({ [sortBy]: sortOrder });
    return next(
      CreateSuccess(200, "Products Retrieved Successfully!", products)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching all products")
    );
  }
};
