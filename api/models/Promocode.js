import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema(
  {
    promoCode: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "exact"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PromoCode", PromoCodeSchema);
