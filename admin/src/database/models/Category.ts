import mongoose, { Schema, Document, Model } from "mongoose";

interface ICategory extends Document {
  name: String;
  shops: mongoose.Types.ObjectId[];
  products: {
    _id: string;
    name: string;
    barcode: number;
    description: string;
    stock_level: number;
    unit_price: string;
    category: string;
  }[]; // Reference to Product documents
}

const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
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
  shops: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShopModel"
    },
  ],
});

export default mongoose.models.CategoryModel ||
  mongoose.model<ICategory>("CategoryModel", categorySchema);
