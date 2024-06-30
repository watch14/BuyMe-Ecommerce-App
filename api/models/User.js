import mongoose, { Schema } from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilePic: {
      type: String,
      require: false,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    isAdmin: {
      typeof: Boolean,
      default: false,
    },
    //roles
    roles: {
      typeof: [Schema.Types.ObjectId],
      require: true,
      ref: "Role",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", UserSchema);
