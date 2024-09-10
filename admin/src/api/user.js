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
var user_service_1 = require("../services/user-service");
var auth_1 = require("./middlewares/auth");
var app_errors_1 = require("../utils/errors/app-errors");
var utils_1 = require("../utils");
var config_1 = require("../config");
var user_validator_1 = require("./middlewares/validator/user-validator");
exports.default = (function (app, channel) {
    var service = new user_service_1.UserService();
    (0, utils_1.SubscribeMessage)(channel, service);
    app.post("/users", auth_1.default, user_validator_1.ValidateUser, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, last_name, first_name, shop, address, role, data, payload, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, email = _a.email, password = _a.password, last_name = _a.last_name, first_name = _a.first_name, shop = _a.shop, address = _a.address, role = _a.role;
                    if (!email || !password || !first_name || !last_name || !address) {
                        throw new app_errors_1.APIError("Please fill in all the fields");
                    }
                    return [4 /*yield*/, service.CreateUser({
                            address: address,
                            email: email,
                            password: password,
                            last_name: last_name,
                            first_name: first_name,
                            shop: shop,
                            role: role,
                        })];
                case 1:
                    data = _b.sent();
                    console.log({ data: data });
                    return [4 /*yield*/, service.CreateUserPayload(data.data, "CREATE_USER")];
                case 2:
                    payload = _b.sent();
                    (0, utils_1.PublishMessage)(channel, config_1.USER_SERVICE, JSON.stringify(payload));
                    res.json({ response: data });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    next(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get("/users/:id", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.params.id;
                    return [4 /*yield*/, service.GetUserById(userId)];
                case 1:
                    user = _a.sent();
                    res.json({ response: user });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    next(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/users", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var page, limit, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    page = Number(req.query.page);
                    limit = 10;
                    if (!page) {
                        page = 1;
                    }
                    return [4 /*yield*/, service.GetUsers({ limit: limit, page: page })];
                case 1:
                    data = (_a.sent()).data;
                    res.json({ response: data });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    next(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.put("/users/:id", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, _a, email, last_name, first_name, shop, address, role, data, payload, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    userId = req.params.id;
                    _a = req.body, email = _a.email, last_name = _a.last_name, first_name = _a.first_name, shop = _a.shop, address = _a.address, role = _a.role;
                    if (!email || !first_name || !last_name || !address || !shop) {
                        throw new app_errors_1.APIError("Please fill in all the fields");
                    }
                    return [4 /*yield*/, service.UpdateUser(userId, {
                            email: email,
                            last_name: last_name,
                            first_name: first_name,
                            shop: shop,
                            address: address,
                            role: role,
                        })];
                case 1:
                    data = (_b.sent()).data;
                    return [4 /*yield*/, service.UpdateUserPayload(data, "UPDATE_USER")];
                case 2:
                    payload = _b.sent();
                    (0, utils_1.PublishMessage)(channel, config_1.USER_SERVICE, JSON.stringify(payload));
                    return [2 /*return*/, res.json({ response: data })];
                case 3:
                    error_4 = _b.sent();
                    next(error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.delete("/users/:id", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var user_id, data, payload, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    user_id = req.params.id;
                    return [4 /*yield*/, service.DeleteUser(user_id)];
                case 1:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, service.DeleteUserPayload(user_id, "DELETE_USER")];
                case 2:
                    payload = _a.sent();
                    (0, utils_1.PublishMessage)(channel, config_1.USER_SERVICE, JSON.stringify(payload));
                    return [2 /*return*/, res.json({ response: data })];
                case 3:
                    error_5 = _a.sent();
                    next(error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get("*", function (req, res) {
        throw new app_errors_1.APIError("Route does not exists");
    });
});
