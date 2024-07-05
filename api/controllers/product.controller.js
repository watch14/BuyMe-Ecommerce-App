import Product from "../models/Product.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Create Product
export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      productName: req.body.productName,
      categoryId: req.body.categoryId,
      productPrice: req.body.productPrice,
      productPicture: req.body.productPicture,
      productDescription: req.body.productDescription,
      productRate: req.body.productRate,
      productStock: req.body.productStock,
    };

    // Add optional fields if provided
    if (req.body.productColor) {
      productData.productColor = req.body.productColor;
    }
    if (req.body.productDiscount !== undefined) {
      productData.productDiscount = req.body.productDiscount;
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    return next(
      CreateSuccess(200, "Product Created Successfully!", newProduct)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for Creating a Product!")
    );
  }
};

// Update Product by ID
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(
        CreateSuccess(200, "Product Updated Successfully!", updatedProduct)
      );
    } else {
      return next(CreateError(404, "Product Not Found!"));
    }
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Updating a Product!")
    );
  }
};

// Controller function to get all products with optional search, price range, category filters, and stock filter
export const getAllProducts = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, category, filterByStock } = req.query; // Extract query parameters

    let query = {}; // Initialize query object

    // If 'q' parameter is present, add search criteria to the query
    if (q) {
      query.$or = [
        { productName: { $regex: q, $options: "i" } }, // Case-insensitive search on productName
        { productDescription: { $regex: q, $options: "i" } }, // Case-insensitive search on productDescription
      ];
    }

    // Add price range filter if minPrice or maxPrice are provided
    if (minPrice || maxPrice) {
      query.productPrice = {}; // Initialize productPrice filter object

      if (minPrice) {
        query.productPrice.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
      }

      if (maxPrice) {
        query.productPrice.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
      }
    }

    // Add category filter if category is provided
    if (category) {
      query.categoryId = category; // Filter by categoryId
    }

    // Add stock filter based on filterByStock parameter
    if (filterByStock === "false") {
      query.productStock = { $gt: 0 }; // Filter where productStock is greater than 0
    }
    // No stock filter applied if filterByStock is not 'false' or not provided

    // Find products based on constructed query
    const products = await Product.find(query);

    // Respond with success message and products
    return next(
      CreateSuccess(200, "Products Retrieved Successfully!", products)
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching all products")
    );
  }
};

// Get Product by ID
export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(CreateError(404, "Product Not Found!"));
    }
    return next(CreateSuccess(200, "Product Retrieved Successfully!", product));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for fetching product by ID")
    );
  }
};

// Delete Product by ID
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(CreateError(404, "Product Not Found!"));
    }
    await Product.findByIdAndDelete(productId);

    return next(CreateSuccess(200, "Product Deleted Successfully!"));
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for deleting product!")
    );
  }
};
