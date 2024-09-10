import mongoose, { Types, Document } from "mongoose";

interface IProduct extends Document {
  product_id: string;
  shop: string;
  name: string;
  barcode: number;
  description: string;
  stock_level: number;
  unit_price: number;
}
const Schema = mongoose.Schema;

// delete mongoose.models.User;
const productSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    shop: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true }
);

export default mongoose.models.ProductModel ||
  mongoose.model<IProduct>("ProductModel", productSchema);
