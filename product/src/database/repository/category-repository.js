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
exports.CatgoryRepository = void 0;
var Category_1 = require("../models/Category");
var Shop_1 = require("../models/Shop");
var shop_repository_1 = require("./shop-repository");
var mongoose_1 = require("mongoose");
var app_errors_1 = require("../../utils/errors/app-errors");
var CatgoryRepository = /** @class */ (function () {
    function CatgoryRepository() {
        this.shopRepositort = new shop_repository_1.ShopRepository();
    }
    CatgoryRepository.prototype.CreateCategory = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var new_category, categoryResult;
            var name = _b.name, category_id = _b.category_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log({ name: name, category_id: category_id });
                        new_category = new Category_1.default({
                            name: name,
                            category_id: category_id,
                        });
                        return [4 /*yield*/, new_category.save()];
                    case 1:
                        categoryResult = _c.sent();
                        console.log("Category created");
                        return [2 /*return*/, categoryResult];
                }
            });
        });
    };
    CatgoryRepository.prototype.FindCategory = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Category_1.default.findOne(__assign({}, data))];
                    case 1:
                        existingCategory = _a.sent();
                        return [2 /*return*/, existingCategory];
                }
            });
        });
    };
    CatgoryRepository.prototype.UpdateCategory = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var exsitingCategory, existedShop;
            var name = _b.name, category_id = _b.category_id, shop_id = _b.shop_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.FindCategory({ category_id: category_id })];
                    case 1:
                        exsitingCategory = _c.sent();
                        if (!shop_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.shopRepositort.FindShop({ shop_id: shop_id })];
                    case 2:
                        existedShop = _c.sent();
                        if (!exsitingCategory.shops.includes(existedShop._id)) {
                            exsitingCategory.shops.push(existedShop._id);
                        }
                        if (!!existedShop.categories.includes(exsitingCategory._id)) return [3 /*break*/, 4];
                        existedShop.categories.push(exsitingCategory._id);
                        return [4 /*yield*/, existedShop.save()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        exsitingCategory.name = name;
                        return [4 /*yield*/, exsitingCategory.save()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, exsitingCategory];
                }
            });
        });
    };
    CatgoryRepository.prototype.GetCategoryById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoose_1.default.isValidObjectId(id)) {
                            throw new app_errors_1.ValidationError("Not valid ID");
                        }
                        return [4 /*yield*/, Category_1.default.findById(id).populate("products")];
                    case 1:
                        existingCategory = _a.sent();
                        if (!existingCategory) {
                            throw new app_errors_1.NotFoundError("Category with that ID doe not exist");
                        }
                        return [2 /*return*/, existingCategory];
                }
            });
        });
    };
    CatgoryRepository.prototype.GetCategoryOfShopById = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoose_1.default.isValidObjectId(id)) {
                            throw new app_errors_1.ValidationError("Not valid ID");
                        }
                        return [4 /*yield*/, Category_1.default.findOne({
                                _id: id,
                                shops: shop,
                            }).populate("products")];
                    case 1:
                        existingCategory = _a.sent();
                        if (!existingCategory) {
                            throw new app_errors_1.NotFoundError("Category with that ID does not exist");
                        }
                        return [2 /*return*/, existingCategory];
                }
            });
        });
    };
    CatgoryRepository.prototype.GetCategories = function (shop_id_1, _a) {
        return __awaiter(this, arguments, void 0, function (shop_id, _b) {
            var totalDocuments, totalPages, skip, existingCategories;
            var limit = _b.limit, page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Shop_1.default.countDocuments()];
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
                        return [4 /*yield*/, Shop_1.default.find({ shop_id: shop_id })
                                .skip(skip)
                                .limit(limit)
                                .populate("categories")];
                    case 2:
                        existingCategories = _c.sent();
                        return [2 /*return*/, {
                                data: existingCategories,
                                currentPage: page,
                                totalPages: totalPages,
                                totalDocuments: totalDocuments,
                            }];
                }
            });
        });
    };
    return CatgoryRepository;
}());
exports.CatgoryRepository = CatgoryRepository;
