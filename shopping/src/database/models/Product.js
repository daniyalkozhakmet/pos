"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
// delete mongoose.models.User;
var productSchema = new Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.models.ProductModel ||
    mongoose_1.default.model("ProductModel", productSchema);
