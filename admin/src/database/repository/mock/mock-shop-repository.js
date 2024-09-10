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
exports.MockShopRepository = void 0;
var MockShopRepository = /** @class */ (function () {
    function MockShopRepository() {
    }
    MockShopRepository.prototype.CreateShop = function (data) {
        var mockShop = __assign({ _id: 123 }, data);
        return Promise.resolve(mockShop);
    };
    MockShopRepository.prototype.GetShops = function (data) {
        return Promise.resolve(data);
    };
    MockShopRepository.prototype.GetShopById = function (id) {
        return Promise.resolve(id);
    };
    MockShopRepository.prototype.UpdateShop = function (id, data) {
        return Promise.resolve(id);
    };
    return MockShopRepository;
}());
exports.MockShopRepository = MockShopRepository;
