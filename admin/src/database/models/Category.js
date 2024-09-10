"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ShopModel"
        },
    ],
});
exports.default = mongoose_1.default.models.CategoryModel ||
    mongoose_1.default.model("CategoryModel", categorySchema);
