"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
var Product_1 = require("../models/Product");
var category_repository_1 = require("./category-repository");
var mongoose_1 = require("mongoose");
var app_errors_1 = require("../../utils/errors/app-errors");
var supplier_repository_1 = require("./supplier-repository");
var shop_repository_1 = require("./shop-repository");
var Category_1 = require("../models/Category");
var Supplier_1 = require("../models/Supplier");
var ProductRepository = /** @class */ (function () {
    function ProductRepository() {
        this.categoryRepository = new category_repository_1.CatgoryRepository();
        this.supplierRepository = new supplier_repository_1.SupplierRepository();
        this.shopRepository = new shop_repository_1.ShopRepository();
    }
    ProductRepository.prototype.CreateProduct = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var categoryExist, new_product, existingSupllier, productResult;
            var name = _b.name, barcode = _b.barcode, description = _b.description, stock_level = _b.stock_level, unit_price = _b.unit_price, category = _b.category, supplier = _b.supplier, shop_id = _b.shop_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.categoryRepository.GetCategoryById(category)];
                    case 1:
                        categoryExist = _c.sent();
                        new_product = new Product_1.default({
                            name: name,
                            barcode: barcode,
                            description: description,
                            stock_level: stock_level,
                            unit_price: unit_price,
                            category: categoryExist,
                            shop: shop_id,
                        });
                        if (!supplier) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.supplierRepository.GetSupllierOfShopById(supplier, shop_id)];
                    case 2:
                        existingSupllier = _c.sent();
                        new_product.suppliers.push(existingSupllier._id);
                        _c.label = 3;
                    case 3: return [4 /*yield*/, new_product.save()];
                    case 4:
                        productResult = _c.sent();
                        console.log({ productResult: productResult });
                        categoryExist.products.push(productResult._id);
                        return [4 /*yield*/, categoryExist.save()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, productResult];
                }
            });
        });
    };
    ProductRepository.prototype.GetAllProducts = function (shop_id_1, _a) {
        return __awaiter(this, arguments, void 0, function (shop_id, _b) {
            var totalDocuments, totalPages, skip, products;
            var page = _b.page, limit = _b.limit;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Product_1.default.countDocuments()];
                    case 1:
                        totalDocuments = _c.sent();
                        totalPages = Math.ceil(totalDocuments / limit);
                        skip = (page - 1) * limit;
                        if (totalPages < page) {
                            page = totalPages;
                            skip = (page - 1) * limit;
                        }
                        if (page < 0) {
                            page = 1;
                            skip = (page - 1) * limit;
                        }
                        return [4 /*yield*/, Product_1.default.find({ shop: shop_id })
                                .skip(skip)
                                .limit(limit)];
                    case 2:
                        products = _c.sent();
                        return [2 /*return*/, {
                                data: products,
                                currentPage: page,
                                totalPages: totalPages,
                                totalDocuments: totalDocuments,
                            }];
                }
            });
        });
    };
    ProductRepository.prototype.GetProductById = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProduct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoose_1.default.isValidObjectId(id)) {
                            throw new app_errors_1.ValidationError("Not valid ID");
                        }
                        return [4 /*yield*/, Product_1.default.findOne({ _id: id, shop: shop })
                                .populate("category")
                                .populate("suppliers")];
                    case 1:
                        existingProduct = _a.sent();
                        if (!existingProduct) {
                            throw new app_errors_1.NotFoundError("Product does not exists with that ID");
                        }
                        return [2 /*return*/, existingProduct];
                }
            });
        });
    };
    ProductRepository.prototype.UpdateProduct = function (id, shop, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProduct, category, supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetProductById(id, shop)];
                    case 1:
                        existingProduct = _a.sent();
                        existingProduct.name = data.name;
                        existingProduct.barcode = data.barcode;
                        existingProduct.description = data.description;
                        existingProduct.stock_level = data.stock_level;
                        existingProduct.unit_price = data.unit_price;
                        category = data.category, supplier = data.supplier;
                        if (!(category != existingProduct.category)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdateCategoryOfProduct(existingProduct.category, category, existingProduct._id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, existingProduct.save()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, existingProduct];
                }
            });
        });
    };
    ProductRepository.prototype.DeleteProduct = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProduct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetProductById(id, shop)];
                    case 1:
                        existingProduct = _a.sent();
                        return [4 /*yield*/, Category_1.default.findByIdAndUpdate(existingProduct.category, {
                                $pull: { products: existingProduct._id },
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Supplier_1.default.findOneAndUpdate({ products: existingProduct._id }, {
                                $pull: { products: existingProduct._id },
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, existingProduct.deleteOne()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductRepository.prototype.UpdateCategoryOfProduct = function (from_id, to_id, product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Category_1.default.findByIdAndUpdate(from_id, {
                            $pull: { products: product_id },
                        })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, Category_1.default.findByIdAndUpdate(to_id, {
                                $addToSet: { products: product_id },
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        throw new app_errors_1.ValidationError("Category with that ID does not exist");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductRepository.prototype.PurchaseProduct = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = data.products.map(function (item) {
                            return Product_1.default.updateOne({ _id: item.product_id }, // Find by product ID
                            [
                                {
                                    $set: {
                                        stock_level: {
                                            $cond: [
                                                { $lt: [{ $subtract: ["$stock_level", item.qty] }, 0] },
                                                0,
                                                { $subtract: ["$stock_level", item.qty] },
                                            ],
                                        },
                                    },
                                },
                            ]).exec(); // Use exec() to return a promise
                        });
                        return [4 /*yield*/, Promise.all(updates)];
                    case 1:
                        results = _a.sent();
                        console.log("Product has been purchased");
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProductRepository;
}());
exports.ProductRepository = ProductRepository;
