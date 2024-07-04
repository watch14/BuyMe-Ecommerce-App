import Promocode from "../models/Promocode.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

//create promocode
export const createPromoCode = async (req, res, next) => {
  try {
    if (req.body.promoCode && req.body.promoCode !== "") {
      const newPromoCode = new Promocode(req.body);
      await newPromoCode.save();

      return next(CreateSuccess(200, "Promo Code Created Successfully!"));
    } else {
      return next(CreateError(400, "Bad Request for Creating a Promo Code!"));
    }
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Creating a Promo Code!")
    );
  }
};

//get all Promo Codes
export const getAllPromoCodes = async (req, res, next) => {
  try {
    const promoCodes = await Promocode.find();
    return next(
      CreateSuccess(200, "Categorys Retrieved Successfully!", promoCodes)
    );
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for fetching all categorys")
    );
  }
};

//get Promo Code by ID
export const getPromoCodeById = async (req, res, next) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await Promocode.findById(promoCodeId);
    if (!promoCode) {
      return next(CreateError(404, "category not found"));
    }
    return next(
      CreateSuccess(200, "Category Retrieved Successfully!", promoCode)
    );
  } catch (error) {
    console.error(error);

    return next(
      CreateError(500, "Internal Server Error for fetching category by ID")
    );
  }
};

//delete Promo Coed by ID
export const deletePromoCode = async (req, res, next) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await Promocode.findById(promoCodeId);
    if (!promoCode) {
      return next(CreateError(404, "Category not found!"));
    }
    await Promocode.findByIdAndDelete(promoCode);

    return next(CreateSuccess(200, "Category Deleted Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for deleting category!")
    );
  }
};
