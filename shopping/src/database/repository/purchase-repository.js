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
exports.PurchaseRepository = void 0;
var app_errors_1 = require("../../utils/errors/app-errors");
var Cart_1 = require("../models/Cart");
var Product_1 = require("../models/Product");
var product_repository_1 = require("./product-repository");
var PurchaseRepository = /** @class */ (function () {
    function PurchaseRepository() {
        this.productRepository = new product_repository_1.ProductRepository();
    }
    PurchaseRepository.prototype.AddtoCart = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, quantity) {
            var shop, existingProduct, activeCart, cartItem, total_sum;
            if (quantity === void 0) { quantity = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shop = data.shop;
                        return [4 /*yield*/, this.productRepository.FindProduct(data)];
                    case 1:
                        existingProduct = _a.sent();
                        return [4 /*yield*/, this.GetActiveCart(shop)];
                    case 2:
                        activeCart = _a.sent();
                        cartItem = activeCart.items.find(function (item) { return item.product.toString() === existingProduct._doc._id.toString(); });
                        if (cartItem) {
                            // If the product is already in the cart, increase the quantity
                            if (quantity == 1) {
                                cartItem.qty += quantity;
                                // activeCart.total_sum = existingProduct._doc.unit_price * cartItem.qty;
                            }
                            else {
                                cartItem.qty = quantity;
                            }
                            cartItem.price = cartItem.qty * existingProduct._doc.unit_price;
                            cartItem.product_id = existingProduct._doc.product_id;
                        }
                        else {
                            // If the product is not in the cart, add it
                            activeCart.items.push({
                                product: existingProduct._id,
                                product_id: existingProduct._doc.product_id,
                                qty: quantity,
                                price: existingProduct._doc.unit_price * quantity,
                            });
                            //   activeCart.total_sum = existingProduct._doc.unit_price * quantity;
                        }
                        total_sum = 0;
                        activeCart.items.forEach(function (item) {
                            total_sum += item.price;
                        });
                        activeCart.total_sum = total_sum;
                        return [4 /*yield*/, activeCart.save()];
                    case 3:
                        _a.sent();
                        console.log("Product added to cart successfully");
                        return [2 /*return*/, activeCart];
                }
            });
        });
    };
    PurchaseRepository.prototype.RemoveFromCart = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var shop, existingProduct, activeCart, itemIndex, total_sum_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shop = data.shop;
                        return [4 /*yield*/, this.productRepository.FindProduct(data)];
                    case 1:
                        existingProduct = _a.sent();
                        return [4 /*yield*/, this.GetActiveCart(shop)];
                    case 2:
                        activeCart = _a.sent();
                        itemIndex = activeCart.items.findIndex(function (item) { return item.product.toString() === existingProduct._doc._id.toString(); });
                        if (!(itemIndex > -1)) return [3 /*break*/, 4];
                        // Remove the item from the array
                        activeCart.items.splice(itemIndex, 1);
                        total_sum_1 = 0;
                        activeCart.items.forEach(function (item) {
                            total_sum_1 += item.price;
                        });
                        activeCart.total_sum = total_sum_1;
                        return [4 /*yield*/, activeCart.save()];
                    case 3:
                        _a.sent();
                        console.log("Product removed from cart successfully");
                        return [3 /*break*/, 5];
                    case 4:
                        console.log("Product not found in cart");
                        _a.label = 5;
                    case 5: return [4 /*yield*/, activeCart.save()];
                    case 6:
                        _a.sent();
                        console.log("Product removed from cart successfully");
                        return [2 /*return*/, activeCart];
                }
            });
        });
    };
    PurchaseRepository.prototype.CompletePurchase = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var shop, payment_method, activeCart, updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shop = data.shop, payment_method = data.payment_method;
                        return [4 /*yield*/, this.GetActiveCartLast(shop)];
                    case 1:
                        activeCart = _a.sent();
                        activeCart.is_paid = true;
                        switch (payment_method) {
                            case Cart_1.PaymentMethod.CASH:
                                activeCart.payment_method = Cart_1.PaymentMethod.CASH;
                                break;
                            case Cart_1.PaymentMethod.NONCASH:
                                activeCart.payment_method = Cart_1.PaymentMethod.NONCASH;
                                break;
                            default:
                                break;
                        }
                        return [4 /*yield*/, activeCart.save()];
                    case 2:
                        _a.sent();
                        updates = activeCart.items.map(function (item) {
                            return Product_1.default.updateOne({ _id: item.product }, // Find by product ID
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
                            ]).exec();
                        });
                        return [4 /*yield*/, Promise.all(updates)];
                    case 3:
                        _a.sent();
                        console.log("Purchase completed successfully");
                        return [2 /*return*/, activeCart];
                }
            });
        });
    };
    PurchaseRepository.prototype.GetActiveCartLast = function (shop) {
        return __awaiter(this, void 0, void 0, function () {
            var activeCart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Cart_1.default.findOne({ shop: shop, is_paid: false })];
                    case 1:
                        activeCart = _a.sent();
                        if (!activeCart) {
                            throw new app_errors_1.NotFoundError("Cart not found");
                        }
                        return [2 /*return*/, activeCart];
                }
            });
        });
    };
    PurchaseRepository.prototype.GetActiveCart = function (shop) {
        return __awaiter(this, void 0, void 0, function () {
            var activeCart, newActiveCart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Cart_1.default.findOne({ shop: shop, is_paid: false })];
                    case 1:
                        activeCart = _a.sent();
                        if (!!activeCart) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CreateCart(shop)];
                    case 2:
                        newActiveCart = _a.sent();
                        return [2 /*return*/, newActiveCart];
                    case 3: return [2 /*return*/, activeCart];
                }
            });
        });
    };
    PurchaseRepository.prototype.CreateCart = function (shop) {
        return __awaiter(this, void 0, void 0, function () {
            var createdCart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createdCart = new Cart_1.default({
                            shop: shop,
                            items: [],
                        });
                        return [4 /*yield*/, createdCart.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, createdCart];
                }
            });
        });
    };
    return PurchaseRepository;
}());
exports.PurchaseRepository = PurchaseRepository;
