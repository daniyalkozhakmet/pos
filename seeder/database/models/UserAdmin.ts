import mongoose, { Connection, Model } from "mongoose";
import { IUser, UserRole } from "../utils";
const Schema = mongoose.Schema;

// delete mongoose.models.User;
const userSchema = new Schema(
  {
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
    is_verified: {
      type: Boolean,
      default: false,
    },
    verification_code: {
      type: Number,
      default: null, // Default to null if no code is set
    },
    code_expires: {
      type: Date,
      default: null, // Default to null if no expiration is set
    },
    failed_attempts: {
      type: Number,
      default: 0, // Start at 0 failed attempts
    },
    lockout_time: {
      type: Date, // Stores the time when the user was locked out
      default: null,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopModel",
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

export const createUserAdminModel = (connection: Connection): Model<IUser> =>
  connection.model<IUser>("UserModel", userSchema);
