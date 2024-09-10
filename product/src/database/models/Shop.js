"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var shopSchema = new mongoose_1.Schema({
    name: { type: String },
    shop_id: { type: String },
    categories: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "CategoryModel",
        },
    ],
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ProductModel" }],
});
exports.default = mongoose_1.default.models.ShopModel ||
    mongoose_1.default.model("ShopModel", shopSchema);
