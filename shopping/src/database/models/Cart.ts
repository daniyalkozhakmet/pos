import mongoose, { Types, Document } from "mongoose";
export enum PaymentMethod {
  CASH = "cash",
  NONCASH = "noncash",
}
interface ICartItem extends Document {
  product: mongoose.Types.ObjectId;
  product_id: string;
  qty: number;
  price: number;
}

interface ICart extends Document {
  items: ICartItem[];
  shop: string;
  total_sum: number;
  is_paid: boolean;
  payment_method: PaymentMethod;
}
const Schema = mongoose.Schema;

// delete mongoose.models.User;
const CartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  product_id: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 1 },
});
const cartSchema = new Schema(
  {
    items: [CartItemSchema],
    shop: {
      type: String,
      required: true,
    },
    total_sum: {
      type: Number,
      required: true,
      default: 0,
    },
    is_paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.NONCASH,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CartModel ||
  mongoose.model<ICart>("CartModel", cartSchema);
