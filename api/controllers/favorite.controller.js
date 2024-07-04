import Favorite from "../models/Favorite.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Add to Favorite
export const addToFavorite = async (req, res, next) => {
  const favoriteData = {
    userId: req.body.userId,
    productId: req.body.productId,
  };

  const favorite = new Favorite(favoriteData);

  try {
    const newFavorite = await favorite.save();
    return next(
      CreateSuccess(201, "Added to Favorites Successfully!", newFavorite)
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
    const favorite = await Favorite.findOneAndDelete({ userId, productId });
    if (!favorite) {
      return next(CreateError(404, "Favorite not found!"));
    }
    return next(CreateSuccess(200, "Removed from Favorites Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for Removing from Favorites!")
    );
  }
};
