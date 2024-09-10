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
exports.CategoryService = void 0;
var category_repository_1 = require("../database/repository/category-repository");
var utils_1 = require("../utils");
var app_errors_1 = require("../utils/errors/app-errors");
var CategoryService = /** @class */ (function () {
    function CategoryService() {
        this.categoryRepository = new category_repository_1.CatgoryRepository();
    }
    CategoryService.prototype.GetAllCategories = function (shop_id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryRepository.GetCategories(shop_id, data)];
                    case 1:
                        categories = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)(categories)];
                }
            });
        });
    };
    CategoryService.prototype.CreateCategory = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var createCategory;
            var name = _b.name, category_id = _b.category_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!name) {
                            throw new app_errors_1.APIError("error");
                        }
                        return [4 /*yield*/, this.categoryRepository.CreateCategory({
                                name: name,
                                category_id: category_id,
                            })];
                    case 1:
                        createCategory = _c.sent();
                        console.log("Category Created");
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: createCategory })];
                }
            });
        });
    };
    CategoryService.prototype.UpdateCategory = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var updateCategory;
            var name = _b.name, category_id = _b.category_id, shop_id = _b.shop_id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.categoryRepository.UpdateCategory({
                            name: name,
                            category_id: category_id,
                            shop_id: shop_id,
                        })];
                    case 1:
                        updateCategory = _c.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: updateCategory })];
                }
            });
        });
    };
    CategoryService.prototype.GetCategoryOfShopById = function (id, shop) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryRepository.GetCategoryOfShopById(id, shop)];
                    case 1:
                        existingCategory = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: existingCategory })];
                }
            });
        });
    };
    CategoryService.prototype.SubscribeEvents = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var event, data, user;
            return __generator(this, function (_a) {
                console.log("Triggering.... User Events");
                payload = JSON.parse(payload);
                event = payload.event, data = payload.data;
                user = data.user;
                switch (event) {
                    case "CREATE_CATEGORY":
                        this.CreateCategory(data);
                        break;
                    case "UPDATE_CATEGORY":
                        this.UpdateCategory(data);
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    return CategoryService;
}());
exports.CategoryService = CategoryService;
