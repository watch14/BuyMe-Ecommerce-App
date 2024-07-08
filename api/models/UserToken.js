import mongoose, { Schema } from "mongoose";

const TokenShema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  CreatedAy: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

export default mongoose.model("Token", TokenShema);
