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
var user_update_validator_1 = require("./middlewares/validator/user-update-validator");
var user_verification_validator_1 = require("./middlewares/validator/user-verification-validator");
var user_forgot_validator_1 = require("./middlewares/validator/user-forgot-validator");
var user_password_verification_1 = require("./middlewares/validator/user-password-verification");
exports.default = (function (app, channel) {
    var service = new user_service_1.UserService();
    (0, utils_1.SubscribeMessage)(channel, service);
    app.post("/login", user_validator_1.ValidateUser, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, data, data_verify, payload, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, service.SignIn({ email: email, password: password })];
                case 1:
                    data = (_b.sent()).data;
                    if (!data.token) return [3 /*break*/, 2];
                    res.cookie("token", data.token, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600, // 1 hour in milliseconds
                    });
                    res.cookie("refresh-token", data.refresh_token, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
                    });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, service.GenerateVerificationCode(email)];
                case 3:
                    data_verify = _b.sent();
                    payload = service.SendVerificationCodePayload(data_verify, "VERIFY_EMAIL");
                    (0, utils_1.PublishMessage)(channel, config_1.EMAIL_SERVICE, JSON.stringify(payload));
                    _b.label = 4;
                case 4:
                    res.json({ response: { data: data } });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    next(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    //password/forgot
    app.post("/password/forgot", user_forgot_validator_1.ValidateUserForgot, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var email, data, data_verify, payload, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    email = req.body.email;
                    if (!email) {
                        throw new app_errors_1.APIError("Fill in all fields");
                    }
                    return [4 /*yield*/, service.ForgotPasssword(email)];
                case 1:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, service.GenerateVerificationCode(email)];
                case 2:
                    data_verify = _a.sent();
                    payload = service.SendVerificationCodePayload(data_verify, "FORGOT_PASSWORD");
                    (0, utils_1.PublishMessage)(channel, config_1.EMAIL_SERVICE, JSON.stringify(payload));
                    res.json({ response: { data: data } });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    next(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    ///password/verify
    app.post("/password/verify", user_password_verification_1.ValidatePasswordVerification, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, verification_code, password, data, payload, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, email = _a.email, verification_code = _a.verification_code, password = _a.password;
                    return [4 /*yield*/, service.ResetPassword(email, password, verification_code)];
                case 1:
                    data = (_b.sent()).data;
                    if (!data.token) return [3 /*break*/, 3];
                    res.cookie("token", data.token, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600, // 1 hour in milliseconds
                    });
                    res.cookie("refresh-token", data.refresh_token, {
                        httpOnly: true, // Cookie cannot be accessed via client-side scripts
                        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                        sameSite: "strict", // Helps to prevent CSRF attacks
                        maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
                    });
                    return [4 /*yield*/, service.UpdateUserPayload(data.existingCustomer, "UPDATE_USER")];
                case 2:
                    payload = _b.sent();
                    (0, utils_1.PublishMessage)(channel, config_1.ADMIN_SERVICE, JSON.stringify(payload));
                    _b.label = 3;
                case 3:
                    res.json({ response: { data: data } });
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _b.sent();
                    next(error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    app.post("/email/verify", user_verification_validator_1.ValidateUserVerification, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, verification_code, data, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, verification_code = _a.verification_code;
                    return [4 /*yield*/, service.VerifyEmail(email, verification_code)];
                case 1:
                    data = (_b.sent()).data;
                    if (data.token) {
                        res.cookie("token", data.token, {
                            httpOnly: true, // Cookie cannot be accessed via client-side scripts
                            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                            sameSite: "strict", // Helps to prevent CSRF attacks
                            maxAge: 3600, // 1 hour in milliseconds
                        });
                        res.cookie("refresh-token", data.refresh_token, {
                            httpOnly: true, // Cookie cannot be accessed via client-side scripts
                            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
                            sameSite: "strict", // Helps to prevent CSRF attacks
                            maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
                        });
                    }
                    res.json({ response: { data: data } });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    next(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/refresh/:refresh", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var refresh_token, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    refresh_token = req.params.refresh;
                    if (!refresh_token) return [3 /*break*/, 2];
                    return [4 /*yield*/, service.RefreshToken(refresh_token)];
                case 1:
                    data = (_a.sent()).data;
                    res.json({ response: { data: data } });
                    _a.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    next(error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get("/profile", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.user.id;
                    return [4 /*yield*/, service.GetProfile(id)];
                case 1:
                    data = (_a.sent()).data;
                    console.log({ data: data });
                    res.json({ response: { data: data } });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    next(error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/logout", auth_1.default, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.clearCookie("refresh-token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.json({ response: { data: { message: "Logged out successfully" } } });
            return [2 /*return*/];
        });
    }); });
    app.put("", auth_1.default, user_update_validator_1.ValidateUserUpdate, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var user_id, _a, first_name, last_name, address, email, data, payload, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    user_id = req.user.id;
                    _a = req.body, first_name = _a.first_name, last_name = _a.last_name, address = _a.address, email = _a.email;
                    return [4 /*yield*/, service.UpdateUserProfile(user_id, {
                            first_name: first_name,
                            last_name: last_name,
                            address: address,
                            email: email,
                        })];
                case 1:
                    data = _b.sent();
                    res.json({ response: { data: data } });
                    return [4 /*yield*/, service.UpdateUserPayload(data, "UPDATE_USER")];
                case 2:
                    payload = _b.sent();
                    (0, utils_1.PublishMessage)(channel, config_1.ADMIN_SERVICE, JSON.stringify(payload));
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _b.sent();
                    next(error_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get("*", function (req, res) {
        throw new app_errors_1.APIError("Route does not exists");
    });
});
// app.post(
//   "/signup",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password, last_name, first_name,shop } = req.body;
//       if (!email || !password || !first_name || !last_name) {
//         throw new APIError(
//           "error",
//           STATUS_CODES.BAD_REQUEST,
//           "Pleas fill in all the fields"
//         );
//       }
//       const { data } = await service.SignUp({
//         shop,
//         email,
//         password,
//         last_name,
//         first_name,
//       });
//       res.cookie("token", data.token, {
//         httpOnly: true, // Cookie cannot be accessed via client-side scripts
//         secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
//         sameSite: "strict", // Helps to prevent CSRF attacks
//         maxAge: 3600000, // 1 hour in milliseconds
//       });
//       res.json(data);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
