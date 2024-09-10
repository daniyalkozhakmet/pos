import mongoose, { Schema, Document, Model } from "mongoose";

interface ISupplier extends Document {
  name: string;
  shop: mongoose.Types.ObjectId;
  address: string;
  phone: string;
  products: mongoose.Types.ObjectId[];
}
const supplierSchema: Schema = new Schema({
  name: { type: String },
  shop: { type: Schema.Types.ObjectId, ref: "ShopModel" },
  address: { type: String },
  phone: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: "ProductModel" }],
});

export default mongoose.models.SupplierModel ||
  mongoose.model<ISupplier>("SupplierModel", supplierSchema);
