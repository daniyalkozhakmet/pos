import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./User";

interface IShop extends Document {
  name: string;
  categories: mongoose.Types.ObjectId[];
  products: {
    _id: string;
    name: string;
    barcode: number;
    description: string;
    stock_level: number;
    unit_price: string;
    category: string;
  }[];
  users: string[];
}

const shopSchema: Schema = new Schema({
  name: String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
  ],
  products: [
    {
      _id: { type: String, require: true },
      name: {
        type: String,
        required: true,
      },
      barcode: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      stock_level: {
        type: Number,
        required: true,
      },
      unit_price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
  users: [{ type: Schema.Types.ObjectId, ref: "UserModel", require: true }],
});

shopSchema.methods.deleteShopAndUsers = async function () {
  try {
    // Delete associated users first
    await User.deleteMany({ shop: this._id });
    // Delete the shop itself
    await this.deleteOne();
  } catch (err) {
    throw new Error(err);
  }
};

export default mongoose.models.ShopModel ||
  mongoose.model<IShop>("ShopModel", shopSchema);
