import mongoose, { Schema, Document, Model } from "mongoose";

interface ICategory extends Document {
  name: string;
  category_id: string;
  shops: mongoose.Types.ObjectId[];
  products: mongoose.Types.ObjectId[]; // Reference to Product documents
}

const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
  category_id: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" }],
  shops: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShopModel",
    },
  ],
});

export default mongoose.models.CategoryModel ||
  mongoose.model<ICategory>("CategoryModel", categorySchema);
