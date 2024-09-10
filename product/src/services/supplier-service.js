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
exports.SupplierService = void 0;
var supplier_repository_1 = require("../database/repository/supplier-repository");
var utils_1 = require("../utils");
var SupplierService = /** @class */ (function () {
    function SupplierService() {
        this.supllierRepository = new supplier_repository_1.SupplierRepository();
    }
    SupplierService.prototype.GetAllSuppliersOfShop = function (shop, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSuppliers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supllierRepository.GetAllSuplliersOfShop(shop, data)];
                    case 1:
                        existingSuppliers = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)(existingSuppliers)];
                }
            });
        });
    };
    SupplierService.prototype.CreateSupplier = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createdSupplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supllierRepository.CreateSupllier(data)];
                    case 1:
                        createdSupplier = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: createdSupplier })];
                }
            });
        });
    };
    SupplierService.prototype.GetSupplierById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingSupplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supllierRepository.GetSupllierById(id)];
                    case 1:
                        existingSupplier = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: existingSupplier })];
                }
            });
        });
    };
    SupplierService.prototype.UpdateSupplier = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedSupplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supllierRepository.UpdateSupplier(id, data)];
                    case 1:
                        updatedSupplier = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ data: updatedSupplier })];
                }
            });
        });
    };
    return SupplierService;
}());
exports.SupplierService = SupplierService;
