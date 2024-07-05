import PromoCode from "../models/Promocode.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Create Promo Code
export const createPromoCode = async (req, res, next) => {
  try {
    const { promoCode, discountType, discountValue } = req.body;

    const newPromoCode = new PromoCode({
      promoCode,
      discountType,
      discountValue,
    });

    await newPromoCode.save();

    return next(CreateSuccess(200, "Promo Code Created Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for Creating a Promo Code!")
    );
  }
};

// Get All Promo Codes
export const getAllPromoCodes = async (req, res, next) => {
  try {
    const promoCodes = await PromoCode.find();
    return next(
      CreateSuccess(200, "Promo Codes Retrieved Successfully!", promoCodes)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching all promo codes")
    );
  }
};

// Get Promo Code by ID
export const getPromoCodeById = async (req, res, next) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await PromoCode.findById(promoCodeId);

    if (!promoCode) {
      return next(CreateError(404, "Promo Code not found"));
    }

    return next(
      CreateSuccess(200, "Promo Code Retrieved Successfully!", promoCode)
    );
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for fetching promo code by ID")
    );
  }
};

// Delete Promo Code by ID
export const deletePromoCode = async (req, res, next) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await PromoCode.findByIdAndDelete(promoCodeId);

    if (!promoCode) {
      return next(CreateError(404, "Promo Code not found!"));
    }

    return next(CreateSuccess(200, "Promo Code Deleted Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for deleting promo code!")
    );
  }
};
