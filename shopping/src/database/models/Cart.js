"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
var mongoose_1 = require("mongoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["NONCASH"] = "noncash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var Schema = mongoose_1.default.Schema;
// delete mongoose.models.User;
var CartItemSchema = new Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true,
    },
    product_id: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 1 },
});
var cartSchema = new Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.models.CartModel ||
    mongoose_1.default.model("CartModel", cartSchema);
