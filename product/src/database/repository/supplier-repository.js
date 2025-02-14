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
exports.SupplierRepository = void 0;
var mongoose_1 = require("mongoose");
var app_errors_1 = require("../../utils/errors/app-errors");
var Supplier_1 = require("../models/Supplier");
var shop_repository_1 = require("./shop-repository");
var SupplierRepository = /** @class */ (function () {
    function SupplierRepository() {
        this.shopRepository = new shop_repository_1.ShopRepository();
    }
    SupplierRepository.prototype.CreateSupllier = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var existingShop, newSupplier;
            var name = _b.name, address = _b.address, shop_id = _b.shop_id, phone = _b.phone;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.shopRepository.FindShop({ shop_id: shop_id })];
                    case 1:
                        existingShop = _c.sent();
                        return [4 /*yield*/, Supplier_1.default.create({
                                name: name,
                                address: address,
                                phone: phone,
                                shop: existingShop,
                            })];
                    case 2:
                        newSupplier = _c.sent();
                        return [2 /*return*/, newSupplier];
                }
            });
        });
    };
    SupplierRepository.prototype.GetAllSuplliersOfShop = function (shop_1, _a) {
        return __awaiter(this, arguments, void 0, function (shop, _b) {
            var totalDocuments, totalPages, skip, existingSuplliers;
            var page = _b.page, limit = _b.limit;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Supplier_1.default.countDocuments()];
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
                        return [4 /*yield*/, Supplier_1.default.find({ shop: shop })
                                .skip(skip)
                                .limit(limit)];
                    case 2:
                        existingSuplliers = _c.sent();
                        return [2 /*return*/, {
                                data: existingSuplliers,
                                currentPage: page,
                                totalPages: totalPages,
                                totalDocuments: totalDocuments,
                            }];
                }
            });
        });
    };
    SupplierRepository.prototype.GetSupllierById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSupllier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoose_1.default.isValidObjectId(id)) {
                            throw new app_errors_1.ValidationError("Not valid ID");
                        }
                        return [4 /*yield*/, Supplier_1.default.findById(id)];
                    case 1:
                        existingSupllier = _a.sent();
                        if (!existingSupllier) {
                            throw new app_errors_1.NotFoundError("Supplier not found");
                        }
                        return [2 /*return*/, existingSupllier];
                }
            });
        });
    };
    SupplierRepository.prototype.GetSupllierOfShopById = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSupllier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoose_1.default.isValidObjectId(id)) {
                            throw new app_errors_1.ValidationError("Not valid ID");
                        }
                        return [4 /*yield*/, Supplier_1.default.findOne({ _id: id, shop: shop })];
                    case 1:
                        existingSupllier = _a.sent();
                        if (!existingSupllier) {
                            throw new app_errors_1.NotFoundError("Supplier not found");
                        }
                        return [2 /*return*/, existingSupllier];
                }
            });
        });
    };
    SupplierRepository.prototype.UpdateSupplier = function (id_1, _a) {
        return __awaiter(this, arguments, void 0, function (id, _b) {
            var existingSupllier, existingProduct;
            var name = _b.name, address = _b.address, shop_id = _b.shop_id, phone = _b.phone, product = _b.product;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.GetSupllierById(id)];
                    case 1:
                        existingSupllier = _c.sent();
                        existingSupllier.name = name;
                        existingSupllier.address = address;
                        existingSupllier.phone = phone;
                        if (!product) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.productRepository.GetProductById(product)];
                    case 2:
                        existingProduct = _c.sent();
                        existingSupllier.products.push(existingProduct._id);
                        _c.label = 3;
                    case 3: return [4 /*yield*/, existingSupllier.save()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, existingSupllier];
                }
            });
        });
    };
    return SupplierRepository;
}());
exports.SupplierRepository = SupplierRepository;
