import Category from "../models/Category.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

// Create Category
export const createCategory = async (req, res, next) => {
  try {
    if (req.body.categoryName && req.body.categoryName !== "") {
      const newCategory = new Category(req.body);
      await newCategory.save();

      return next(CreateSuccess(200, "Category Created Successfully!"));
    } else {
      return next(CreateError(400, "Bad Request for Creating a Category!"));
    }
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Creating a Category!")
    );
  }
};

// update Category by id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (category) {
      const newDate = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(CreateSuccess(200, "Category Updated!"));
    } else {
      return next(CreateError(404, "Category Not Found!"));
    }
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for Updating a Category!")
    );
  }
};

//get all Categorys
export const getAllCategorys = async (req, res, next) => {
  try {
    const categorys = await Category.find();
    return next(
      CreateSuccess(200, "Categorys Retrieved Successfully!", categorys)
    );
  } catch (error) {
    return next(
      CreateError(500, "Internal Server Error for fetching all categorys")
    );
  }
};

//get Category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(CreateError(404, "category not found"));
    }
    return next(
      CreateSuccess(200, "Category Retrieved Successfully!", category)
    );
  } catch (error) {
    console.error(error);

    return next(
      CreateError(500, "Internal Server Error for fetching category by ID")
    );
  }
};

//delete category  by ID
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(CreateError(404, "Category not found!"));
    }
    await Category.findByIdAndDelete(categoryId);

    return next(CreateSuccess(200, "Category Deleted Successfully!"));
  } catch (error) {
    console.error(error);
    return next(
      CreateError(500, "Internal Server Error for deleting category!")
    );
  }
};
