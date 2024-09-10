import mongoose, { Schema, Document, Model } from "mongoose";

interface IShop extends Document {
  name: string;
  shop_id: string;
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
}

const shopSchema: Schema = new Schema({
  name: { type: String },
  shop_id: { type: String },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
  ],
  products: [{ type: Schema.Types.ObjectId, ref: "ProductModel" }],
});

export default mongoose.models.ShopModel ||
  mongoose.model<IShop>("ShopModel", shopSchema);
