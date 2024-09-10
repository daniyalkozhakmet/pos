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
var globals_1 = require("@jest/globals");
var faker_1 = require("@faker-js/faker");
var mock_category_repository_1 = require("../../database/repository/mock/mock-category-repository");
var category_service_1 = require("../category-service");
var utils_1 = require("../../utils");
var rosie_1 = require("rosie");
var app_errors_1 = require("../../utils/errors/app-errors");
var CategoryFactory = new rosie_1.Factory()
    .attr("_id", faker_1.faker.number.int({ min: 1, max: 1000 }))
    .attr("name", faker_1.faker.commerce.productName());
var mockCategory = function (rest) {
    return __assign({ name: faker_1.faker.commerce.productName() }, rest);
};
var mockPaginator = function (rest) {
    return __assign({ limit: faker_1.faker.number.int({ min: 10, max: 100 }), page: faker_1.faker.number.int({ min: 10, max: 100 }) }, rest);
};
(0, globals_1.describe)("Category Service", function () {
    var repository;
    (0, globals_1.beforeEach)(function () {
        repository = new mock_category_repository_1.MockCategoryRepository();
    });
    (0, globals_1.afterEach)(function () {
        repository = {};
    });
    (0, globals_1.describe)("Create Category", function () {
        (0, globals_1.test)("Should create category", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, reqBody, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        reqBody = mockCategory({});
                        return [4 /*yield*/, service.CreateCategory(reqBody)];
                    case 1:
                        result = _a.sent();
                        (0, globals_1.expect)(result).toMatchObject((0, utils_1.FormateData)({
                            data: { _id: globals_1.expect.any(Number), name: globals_1.expect.any(String) },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)("Get Categories", function () {
        (0, globals_1.test)("Should get Categories", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, randomLimit, categories, expectedResult, data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        randomLimit = faker_1.faker.number.int({ min: 10, max: 50 });
                        categories = CategoryFactory.buildList(randomLimit);
                        expectedResult = {
                            data: categories,
                            currentPage: faker_1.faker.number.int({ min: 10, max: 100 }),
                            totalPages: faker_1.faker.number.int({ min: 10, max: 100 }),
                            totalDocuments: faker_1.faker.number.int({ min: 10, max: 100 }),
                        };
                        globals_1.jest
                            .spyOn(service.categoryRepository, "GetCategories")
                            .mockImplementationOnce(function () { return Promise.resolve(expectedResult); });
                        data = mockPaginator({});
                        return [4 /*yield*/, service.GetCategories(data)];
                    case 1:
                        result = _a.sent();
                        (0, globals_1.expect)(result).toMatchObject((0, utils_1.FormateData)(expectedResult));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)("Get Category by id", function () {
        (0, globals_1.test)("Should get category", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, id, existingCategory, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        id = faker_1.faker.string.nanoid();
                        existingCategory = mockCategory({ _id: id });
                        globals_1.jest
                            .spyOn(service, "GetCategoryByID")
                            .mockImplementationOnce(function () {
                            return Promise.resolve((0, utils_1.FormateData)(existingCategory));
                        });
                        return [4 /*yield*/, service.GetCategoryByID(id)];
                    case 1:
                        result = _a.sent();
                        (0, globals_1.expect)(result).toMatchObject((0, utils_1.FormateData)(existingCategory));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.test)("Category with that Id does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        id = faker_1.faker.string.nanoid();
                        // Mocking the repository method instead of the service method
                        globals_1.jest
                            .spyOn(service.categoryRepository, "GetCategoryById")
                            .mockImplementationOnce(function () {
                            return Promise.reject(new app_errors_1.NotFoundError("Category not found"));
                        });
                        // Using .rejects.toThrow() to assert the error
                        return [4 /*yield*/, (0, globals_1.expect)(service.GetCategoryByID(id)).rejects.toThrow("Category not found")];
                    case 1:
                        // Using .rejects.toThrow() to assert the error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.test)("Category with invalid Id", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        id = faker_1.faker.string.nanoid();
                        // Mocking the repository method instead of the service method
                        globals_1.jest
                            .spyOn(service.categoryRepository, "GetCategoryById")
                            .mockImplementationOnce(function () {
                            return Promise.reject(new app_errors_1.ValidationError("Not valid ID"));
                        });
                        // Using .rejects.toThrow() to assert the error
                        return [4 /*yield*/, (0, globals_1.expect)(service.GetCategoryByID(id)).rejects.toThrow("Not valid ID")];
                    case 1:
                        // Using .rejects.toThrow() to assert the error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)("Update Category", function () {
        (0, globals_1.test)("Should update Category", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, id, reqBody, expectedResult, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        id = faker_1.faker.string.nanoid();
                        reqBody = mockCategory({});
                        expectedResult = __assign({ id: id }, reqBody);
                        globals_1.jest
                            .spyOn(service.categoryRepository, "UpdateCategory")
                            .mockImplementationOnce(function () { return Promise.resolve(expectedResult); });
                        _a = globals_1.expect;
                        return [4 /*yield*/, service.UpdateCategory(id, reqBody)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toMatchObject((0, utils_1.FormateData)({ data: expectedResult }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.test)("Category with that Id does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var service, id, reqBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new category_service_1.CategoryService();
                        service.categoryRepository = new mock_category_repository_1.MockCategoryRepository();
                        id = faker_1.faker.string.nanoid();
                        reqBody = mockCategory({});
                        globals_1.jest
                            .spyOn(service.categoryRepository, "UpdateCategory")
                            .mockImplementationOnce(function () {
                            return Promise.reject(new app_errors_1.NotFoundError("Category not found"));
                        });
                        return [4 /*yield*/, (0, globals_1.expect)(service.UpdateCategory(id, reqBody)).rejects.toThrow("Category not found")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.test)("New test", function () {
            (0, globals_1.expect)(true).toBe(true);
        });
    });
});
