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
var utils_1 = require("../../utils");
var axios_1 = require("axios");
var config_1 = require("../../config");
var jwt = require("jsonwebtoken");
exports.default = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var isAuthorized, refresh_token, response, _a, token, refresh_token_1, decoded;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                isAuthorized = (0, utils_1.ValidateSignatureCookie)(req);
                if (isAuthorized) {
                    return [2 /*return*/, next()];
                }
                refresh_token = (0, utils_1.ValidateSignatureRefresh)(req);
                if (!refresh_token) return [3 /*break*/, 2];
                return [4 /*yield*/, axios_1.default.post("".concat(config_1.USER_SERVICE_URL, "/refresh/").concat(refresh_token))];
            case 1:
                response = (_b.sent()).data.response;
                if (response.data) {
                    _a = response.data, token = _a.token, refresh_token_1 = _a.refresh_token;
                    console.log({ token: token, refresh_token: refresh_token_1 });
                    decoded = jwt.verify(token, config_1.APP_SECRET);
                    if (decoded.role == "super") {
                        req.user = decoded;
                    }
                    res.cookie("token", token, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600, // 1 hour in milliseconds
                    });
                    res.cookie("refresh-token", refresh_token_1, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
                    });
                    return [2 /*return*/, next()];
                }
                _b.label = 2;
            case 2: return [2 /*return*/, res.status(403).json({ response: { error: "Not Authorized" } })];
        }
    });
}); });
