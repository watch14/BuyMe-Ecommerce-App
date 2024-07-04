import Favorite from "../models/Favorite.js";
import User from "../models/User.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Add to Favorite
export const addToFavorite = async (req, res, next) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(CreateError(404, "User not found!"));
    }

    if (user.favorites.includes(productId)) {
      return next(CreateError(400, "Product already in favorites!"));
    }

    user.favorites.push(productId);
    await user.save();

    return next(
      CreateSuccess(201, "Added to Favorites Successfully!", user.favorites)
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
    const user = await User.findById(userId);
    if (!user) {
      return next(CreateError(404, "User not found!"));
    }

    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== productId
    );
    await user.save();

    return next(
      CreateSuccess(200, "Removed from Favorites Successfully!", user.favorites)
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
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return next(CreateError(404, "User not found!"));
    }

    return next(
      CreateSuccess(200, "Favorites Retrieved Successfully!", user.favorites)
    );
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Internal Server Error for fetching favorites"));
  }
};
