"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category_id: { type: String, required: true },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "ProductModel" }],
    shops: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ShopModel",
        },
    ],
});
exports.default = mongoose_1.default.models.CategoryModel ||
    mongoose_1.default.model("CategoryModel", categorySchema);
