"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ProductService = void 0;
var product_repository_1 = require("../database/repository/product-repository");
var shop_repository_1 = require("../database/repository/shop-repository");
var utils_1 = require("../utils");
var ProductService = /** @class */ (function () {
    function ProductService() {
        this.productRepository = new product_repository_1.ProductRepository();
        this.shopRepository = new shop_repository_1.ShopRepository();
    }
    ProductService.prototype.GetAllProducts = function (shop_id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productRepository.GetAllProducts(shop_id, data)];
                    case 1:
                        products = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)(products)];
                }
            });
        });
    };
    ProductService.prototype.CreateProduct = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var createProduct;
            var name = _b.name, description = _b.description, stock_level = _b.stock_level, barcode = _b.barcode, unit_price = _b.unit_price, category = _b.category, supplier = _b.supplier, shop_id = _b.shop_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.productRepository.CreateProduct({
                            name: name,
                            description: description,
                            stock_level: stock_level,
                            barcode: barcode,
                            unit_price: unit_price,
                            category: category,
                            supplier: supplier,
                            shop_id: shop_id,
                        })];
                    case 1:
                        createProduct = _c.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: createProduct })];
                }
            });
        });
    };
    ProductService.prototype.GetProductById = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProduct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productRepository.GetProductById(id, shop)];
                    case 1:
                        existingProduct = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: existingProduct })];
                }
            });
        });
    };
    ProductService.prototype.UpdateProduct = function (id, shop, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedProduct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productRepository.UpdateProduct(id, shop, data)];
                    case 1:
                        updatedProduct = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: updatedProduct })];
                }
            });
        });
    };
    ProductService.prototype.DeleteProduct = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productRepository.DeleteProduct(id, shop)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ message: "Deleted successfully" })];
                }
            });
        });
    };
    ProductService.prototype.CreateShop = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createShop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shopRepository.CreateShop(data)];
                    case 1:
                        createShop = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: createShop })];
                }
            });
        });
    };
    ProductService.prototype.CreateProductPayload = function (product, event) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                if (product) {
                    console.log(product);
                    payload = {
                        event: event,
                        data: {
                            shop: product.shop,
                            product_id: product._doc._id,
                            name: product._doc.name,
                            barcode: product._doc.barcode,
                            description: product._doc.description,
                            stock_level: product._doc.stock_level,
                            unit_price: product._doc.unit_price,
                        },
                    };
                    return [2 /*return*/, payload];
                }
                else {
                    return [2 /*return*/, (0, utils_1.FormateData)({ error: "No product available" })];
                }
                return [2 /*return*/];
            });
        });
    };
    ProductService.prototype.UpdateProductPayload = function (product, event) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                if (product) {
                    console.log(product);
                    payload = {
                        event: event,
                        data: {
                            shop: product.shop,
                            product_id: product._doc._id,
                            name: product._doc.name,
                            barcode: product._doc.barcode,
                            description: product._doc.description,
                            stock_level: product._doc.stock_level,
                            unit_price: product._doc.unit_price,
                        },
                    };
                    return [2 /*return*/, payload];
                }
                else {
                    return [2 /*return*/, (0, utils_1.FormateData)({ error: "No product available" })];
                }
                return [2 /*return*/];
            });
        });
    };
    ProductService.prototype.DeleteProductPayload = function (product, event) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                if (product) {
                    console.log(product);
                    payload = {
                        event: event,
                        data: __assign({}, product),
                    };
                    return [2 /*return*/, payload];
                }
                else {
                    return [2 /*return*/, (0, utils_1.FormateData)({ error: "No product available" })];
                }
                return [2 /*return*/];
            });
        });
    };
    ProductService.prototype.PurchaseProduct = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productRepository.PurchaseProduct(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // async CreateCategory(data: ICategory) {
    //   const createShop = await this.shopRepository.CreateShop(data);
    //   console.log({ message: "SHOP is created" });
    //   return FormateData({ data: createShop });
    // }
    ProductService.prototype.SubscribeEvents = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var event, data, user;
            return __generator(this, function (_a) {
                console.log("Triggering.... User Events");
                payload = JSON.parse(payload);
                event = payload.event, data = payload.data;
                user = data.user;
                switch (event) {
                    case "CREATE_SHOP":
                        this.CreateShop(data);
                        break;
                    case "PURCHASE_PRODUCT":
                        this.PurchaseProduct(data);
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    return ProductService;
}());
exports.ProductService = ProductService;
