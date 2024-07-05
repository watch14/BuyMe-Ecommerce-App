import Cart from "../models/Cart.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Add or Update Product in Cart
export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate required fields
    if (!userId || !productId || !quantity) {
      return next(
        CreateError(400, "userId, productId, and quantity are required")
      );
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // Check if the products array is empty
      if (!cart.products || cart.products.length === 0) {
        cart.products = [{ productId, quantity }];
      } else {
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(
          (product) => product.productId.toString() === productId
        );

        if (productIndex > -1) {
          // Update the quantity if product already exists
          cart.products[productIndex].quantity += quantity;
        } else {
          // Add new product to the cart
          cart.products.push({ productId, quantity });
        }
      }

      cart.modifiedOn = Date.now();
    }

    await cart.save();
    return res.json(CreateSuccess(200, "Cart Updated Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal server error for adding to or updating a Cart")
    );
  }
};

// Get Cart Details
export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.query;

    // Find the user's cart with products populated
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "productName productPrice"
    );

    if (!cart) {
      return next(CreateError(404, "Cart not found"));
    }

    return res.json(
      CreateSuccess(200, "Cart details retrieved successfully", cart)
    );
  } catch (error) {
    return next(
      CreateError(500, "Internal server error for retrieving the cart")
    );
  }
};

// Empty Cart
export const emptyCart = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return next(CreateError(404, "Cart is already empty or not found"));
    }

    // Clear the products array in the cart
    cart.products = [];

    // Save the updated cart
    await cart.save();
    return res.json(CreateSuccess(200, "Cart emptied successfully!"));
  } catch (error) {
    return next(
      CreateError(500, "Internal server error for emptying the cart")
    );
  }
};

// Delete Product from Cart
export const deleteFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return next(CreateError(404, "Cart is empty or not found"));
    }

    // Check if the product exists in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return next(CreateError(404, "Product not found in the cart"));
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();
    return res.json(
      CreateSuccess(200, "Product removed from cart successfully!")
    );
  } catch (error) {
    return next(
      CreateError(
        500,
        "Internal server error for deleting a product from the cart"
      )
    );
  }
};

// Remove Cart
export const removeCart = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find and delete the cart for the given user ID
    const deletedCart = await Cart.findOneAndDelete({ userId });

    if (!deletedCart) {
      return next(CreateError(404, "Cart not found"));
    }

    return res.json(CreateSuccess(200, "Cart removed successfully!"));
  } catch (error) {
    return next(
      CreateError(500, "Internal server error for removing the cart")
    );
  }
};
