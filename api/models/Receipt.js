import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productList: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);

export default Receipt;
