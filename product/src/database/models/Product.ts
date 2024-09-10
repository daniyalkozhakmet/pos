import mongoose, { Types, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  barcode: number;
  description: string;
  stock_level: number;
  unit_price: number;
  category: mongoose.Types.ObjectId; // Reference to Category document
  shop: mongoose.Types.ObjectId; // Reference to Category document
  suppliers: mongoose.Types.ObjectId[];
}
const Schema = mongoose.Schema;

// delete mongoose.models.User;
const productSchema = new Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    suppliers: [{ type: Schema.Types.ObjectId, ref: "SupplierModel" }],
  },
  { timestamps: true }
);

export default mongoose.models.ProductModel ||
  mongoose.model<IProduct>("ProductModel", productSchema);
