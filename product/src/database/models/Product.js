"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
// delete mongoose.models.User;
var productSchema = new Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CategoryModel",
        required: true,
    },
    shop: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CategoryModel",
        required: true,
    },
    suppliers: [{ type: Schema.Types.ObjectId, ref: "SupplierModel" }],
}, { timestamps: true });
exports.default = mongoose_1.default.models.ProductModel ||
    mongoose_1.default.model("ProductModel", productSchema);
