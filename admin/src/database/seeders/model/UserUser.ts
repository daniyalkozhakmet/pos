import mongoose, { Types, Document } from "mongoose";
import { IUser, UserRole } from "./utils";
const Schema = mongoose.Schema;

// delete mongoose.models.User;
const userSchema = new Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    shop: {
      type: String,
      validate: {
        validator: function (value) {
          // Check if the role is not 'admin' and the shop field is empty
          if (this.role !== UserRole.SUPER && !value) {
            return false;
          }
          return true;
        },
        message: "Shop is required for non-super users.",
      },
      required: function () {
        // The 'shop' field is required if the role is not 'admin'
        return this.role !== UserRole.SUPER;
      },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserModel ||
  mongoose.model<IUser>("UserModel", userSchema);
