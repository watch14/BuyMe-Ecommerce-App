import mongoose, { mongo } from "mongoose";

const CategorySchema = mongoose.Schema(
  {
    promoCode: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PromoCode", CategorySchema);
