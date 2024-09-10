"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var supplierSchema = new mongoose_1.Schema({
    name: { type: String },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "ShopModel" },
    address: { type: String },
    phone: { type: String },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ProductModel" }],
});
exports.default = mongoose_1.default.models.SupplierModel ||
    mongoose_1.default.model("SupplierModel", supplierSchema);
