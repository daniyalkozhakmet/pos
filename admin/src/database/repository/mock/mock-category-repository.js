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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCategoryRepository = void 0;
var MockCategoryRepository = /** @class */ (function () {
    function MockCategoryRepository() {
    }
    MockCategoryRepository.prototype.CreateCategory = function (data) {
        var mockCategory = __assign({ _id: 123 }, data);
        return Promise.resolve(mockCategory);
    };
    MockCategoryRepository.prototype.GetCategories = function (data) {
        return Promise.resolve([]);
    };
    MockCategoryRepository.prototype.GetCategoryById = function (id) {
        return Promise.resolve(id);
    };
    MockCategoryRepository.prototype.UpdateCategory = function (id, data) {
        return Promise.resolve(id);
    };
    return MockCategoryRepository;
}());
exports.MockCategoryRepository = MockCategoryRepository;
