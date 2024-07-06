import Favorite from "../models/Favorite.js";
import User from "../models/User.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Add to Favorite
export const addToFavorite = async (req, res, next) => {
  const { userId, productId } = req.body;

  try {
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({ userId, productIds: [productId] });
    } else {
      if (favorite.productIds.includes(productId)) {
        return next(CreateError(400, "Product already in favorites!"));
      }
      favorite.productIds.push(productId);
    }

    await favorite.save();

    return next(
      CreateSuccess(201, "Added to Favorites Successfully!", favorite)
    );
  } catch (error) {
    console.error(error);
    return next(CreateError(400, "Bad Request for Adding to Favorites!"));
  }
};

// Remove from Favorite
export const removeFromFavorite = async (req, res, next) => {
  const { userId, productId } = req.body;

  try {
    const favorite = await Favorite.findOne({ userId });

    if (!favorite || !favorite.productIds.includes(productId)) {
      return next(CreateError(404, "Product not found in favorites!"));
    }

    favorite.productIds = favorite.productIds.filter(
      (id) => id.toString() !== productId
    );
    await favorite.save();

    return next(
      CreateSuccess(
        200,
        "Removed from Favorites Successfully!",
        favorite.productIds
      )
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for Removing from Favorites!")
    );
  }
};

// Get User Favorites
export const getUserFavorites = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Logging the userId for debugging
    const favorites = await Favorite.findOne({ userId }).populate("productIds");

    // Check if favorites is null and log the result
    if (!favorites) {
      return next(
        CreateSuccess(200, "Favorites Retrieved Successfully!", null)
      );
    }

    return next(
      CreateSuccess(200, "Favorites Retrieved Successfully!", favorites)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching favorites")
    );
  }
};
