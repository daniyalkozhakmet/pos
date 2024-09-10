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
exports.UserService = void 0;
var user_repository_1 = require("../database/repository/user-repository");
var jwt = require("jsonwebtoken");
var utils_1 = require("../utils");
var app_errors_1 = require("../utils/errors/app-errors");
var config_1 = require("../config");
var FAILED_ATTEMPTS = 10;
var UserService = /** @class */ (function () {
    function UserService() {
        this.repository = new user_repository_1.UserRepository();
    }
    UserService.prototype.SignIn = function (userInputs) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, existingCustomer, validPassword, lockout_time, currentTime, lockoutTimeTimestamp, lockout_time, token, refresh_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = userInputs.email, password = userInputs.password;
                        return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        if (!existingCustomer) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, utils_1.ValidatePassword)(password, existingCustomer.password, existingCustomer.salt)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) return [3 /*break*/, 11];
                        if (!existingCustomer.lockout_time) return [3 /*break*/, 5];
                        lockout_time = new Date(existingCustomer.lockout_time);
                        currentTime = Date.now();
                        lockoutTimeTimestamp = lockout_time.getTime();
                        if (!(currentTime < lockoutTimeTimestamp)) return [3 /*break*/, 3];
                        throw new app_errors_1.APIError("Log in back with that credentials later!");
                    case 3:
                        existingCustomer.lockout_time = null;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!!existingCustomer.is_verified) return [3 /*break*/, 7];
                        existingCustomer.failed_attempts++;
                        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
                            lockout_time = Date.now() + 5 * 60 * 1000;
                            existingCustomer.lockout_time = lockout_time;
                            existingCustomer.failed_attempts = 0;
                        }
                        return [4 /*yield*/, existingCustomer.save()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({
                                message: "We sent verification code to ".concat(email, " "),
                                email: email,
                            })];
                    case 7: return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                            id: existingCustomer._id,
                            email: existingCustomer.email,
                            role: existingCustomer.role,
                            first_name: existingCustomer.first_name,
                            last_name: existingCustomer.last_name,
                            shop: existingCustomer.shop ? existingCustomer.shop : "",
                        })];
                    case 8:
                        token = _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignatureRefresh)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 9:
                        refresh_token = _a.sent();
                        existingCustomer.is_verified = true;
                        existingCustomer.code_expires = null;
                        existingCustomer.verification_code = null;
                        existingCustomer.failed_attempts = 0;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ id: existingCustomer._id, token: token, refresh_token: refresh_token })];
                    case 11: throw new app_errors_1.ValidationError("Invalid Credentials");
                }
            });
        });
    };
    UserService.prototype.GenerateVerificationCode = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCustomer, verificationCode, codeExpiration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        verificationCode = Math.floor(100000 + Math.random() * 900000);
                        codeExpiration = Date.now() + 15 * 60 * 1000;
                        existingCustomer.verification_code = verificationCode;
                        existingCustomer.code_expires = codeExpiration;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { email: email, verification_code: verificationCode }];
                }
            });
        });
    };
    UserService.prototype.SendVerificationCodePayload = function (data, event) {
        if (data) {
            var payload = {
                event: event,
                data: data,
            };
            return payload;
        }
        else {
            return (0, utils_1.FormateData)({ error: "No email vericiation available" });
        }
    };
    UserService.prototype.VerifyEmail = function (email, verification_code) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCustomer, lockout_time, currentTime, lockoutTimeTimestamp, codeExpires, currentTime, codeExpiresTimestamp, token, refresh_token, lockout_time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        if (!existingCustomer) return [3 /*break*/, 11];
                        if (!existingCustomer.lockout_time) return [3 /*break*/, 4];
                        lockout_time = new Date(existingCustomer.lockout_time);
                        currentTime = Date.now();
                        lockoutTimeTimestamp = lockout_time.getTime();
                        if (!(currentTime < lockoutTimeTimestamp)) return [3 /*break*/, 2];
                        throw new app_errors_1.APIError("Too many request try later");
                    case 2:
                        existingCustomer.lockout_time = null;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(existingCustomer.verification_code == verification_code)) return [3 /*break*/, 8];
                        codeExpires = new Date(existingCustomer.code_expires);
                        currentTime = Date.now();
                        codeExpiresTimestamp = codeExpires.getTime();
                        if (currentTime > codeExpiresTimestamp) {
                            throw new app_errors_1.APIError("The verification code expired, request it again");
                        }
                        existingCustomer.is_verified = true;
                        existingCustomer.code_expires = null;
                        existingCustomer.verification_code = null;
                        existingCustomer.failed_attempts = 0;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 6:
                        token = _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignatureRefresh)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 7:
                        refresh_token = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ id: existingCustomer._id, token: token, refresh_token: refresh_token })];
                    case 8:
                        existingCustomer.failed_attempts++;
                        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
                            lockout_time = Date.now() + 5 * 60 * 1000;
                            existingCustomer.lockout_time = lockout_time;
                            existingCustomer.failed_attempts = 0;
                        }
                        return [4 /*yield*/, existingCustomer.save()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: throw new app_errors_1.APIError("The verification code does not match");
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.ResetPassword = function (email, password, verification_code) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCustomer, lockout_time, currentTime, lockoutTimeTimestamp, codeExpires, currentTime, codeExpiresTimestamp, salt, newPassword, token, refresh_token, lockout_time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        if (!existingCustomer) return [3 /*break*/, 13];
                        if (!existingCustomer.lockout_time) return [3 /*break*/, 4];
                        lockout_time = new Date(existingCustomer.lockout_time);
                        currentTime = Date.now();
                        lockoutTimeTimestamp = lockout_time.getTime();
                        if (!(currentTime < lockoutTimeTimestamp)) return [3 /*break*/, 2];
                        throw new app_errors_1.APIError("Too many request try later");
                    case 2:
                        existingCustomer.lockout_time = null;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(existingCustomer.verification_code == verification_code)) return [3 /*break*/, 10];
                        codeExpires = new Date(existingCustomer.code_expires);
                        currentTime = Date.now();
                        codeExpiresTimestamp = codeExpires.getTime();
                        if (currentTime > codeExpiresTimestamp) {
                            throw new app_errors_1.APIError("The verification code expired, request it again");
                        }
                        return [4 /*yield*/, (0, utils_1.GenerateSalt)()];
                    case 5:
                        salt = _a.sent();
                        return [4 /*yield*/, (0, utils_1.GeneratePassword)(password, salt)];
                    case 6:
                        newPassword = _a.sent();
                        existingCustomer.is_verified = true;
                        existingCustomer.code_expires = null;
                        existingCustomer.verification_code = null;
                        existingCustomer.failed_attempts = 0;
                        existingCustomer.password = newPassword;
                        existingCustomer.salt = salt;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 8:
                        token = _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignatureRefresh)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 9:
                        refresh_token = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({
                                id: existingCustomer._id,
                                token: token,
                                refresh_token: refresh_token,
                                existingCustomer: existingCustomer,
                            })];
                    case 10:
                        existingCustomer.failed_attempts++;
                        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
                            lockout_time = Date.now() + 5 * 60 * 1000;
                            existingCustomer.lockout_time = lockout_time;
                            existingCustomer.failed_attempts = 0;
                        }
                        return [4 /*yield*/, existingCustomer.save()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: throw new app_errors_1.APIError("The verification code does not match");
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.ForgotPasssword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCustomer, lockout_time, currentTime, lockoutTimeTimestamp, lockout_time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        if (!existingCustomer) return [3 /*break*/, 6];
                        if (!existingCustomer.lockout_time) return [3 /*break*/, 4];
                        lockout_time = new Date(existingCustomer.lockout_time);
                        currentTime = Date.now();
                        lockoutTimeTimestamp = lockout_time.getTime();
                        if (!(currentTime < lockoutTimeTimestamp)) return [3 /*break*/, 2];
                        throw new app_errors_1.APIError("Too many request try later");
                    case 2:
                        existingCustomer.lockout_time = null;
                        return [4 /*yield*/, existingCustomer.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        existingCustomer.failed_attempts++;
                        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
                            lockout_time = Date.now() + 5 * 60 * 1000;
                            existingCustomer.lockout_time = lockout_time;
                            existingCustomer.failed_attempts = 0;
                        }
                        return [4 /*yield*/, existingCustomer.save()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({
                                message: "We sent verification code to ".concat(email, " "),
                                email: email,
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.RefreshToken = function (refresh_token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, email, existingCustomer, token, refresh_token_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decoded = jwt.verify(refresh_token, config_1.APP_SECRET);
                        email = decoded.email;
                        if (!email) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.repository.FindUser({ email: email })];
                    case 1:
                        existingCustomer = _a.sent();
                        if (!existingCustomer) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 2:
                        token = _a.sent();
                        return [4 /*yield*/, (0, utils_1.GenerateSignatureRefresh)({
                                id: existingCustomer._id,
                                email: existingCustomer.email,
                                role: existingCustomer.role,
                                first_name: existingCustomer.first_name,
                                last_name: existingCustomer.last_name,
                                shop: existingCustomer.shop ? existingCustomer.shop : "",
                            })];
                    case 3:
                        refresh_token_1 = _a.sent();
                        return [2 /*return*/, (0, utils_1.FormateData)({ token: token, refresh_token: refresh_token_1 })];
                    case 4: throw new app_errors_1.APIError("Not Authorized");
                }
            });
        });
    };
    // async SignUp(userInputs: UserSignUpInputs) {
    //   const { email, password, first_name, last_name, shop } = userInputs;
    //   const existingUser = await this.repository.FindUser({ email });
    //   if (existingUser) {
    //     throw new APIError(
    //       "error",
    //       STATUS_CODES.BAD_REQUEST,
    //       "User already exists"
    //     );
    //   }
    //   // create salt
    //   let salt = await GenerateSalt();
    //   let userPassword = await GeneratePassword(password, salt);
    //   const existingCustomer = await this.repository.CreateUser({
    //     shop,
    //     email,
    //     salt,
    //     password: userPassword,
    //     first_name,
    //     last_name,
    //     role: UserRole.USER,
    //   });
    //   const token = await GenerateSignature({
    //     id: existingCustomer._id,
    //     email: existingCustomer.email,
    //     role: existingCustomer.role,
    //     first_name: existingCustomer.first_name,
    //     last_name: existingCustomer.last_name,
    //   });
    //   return FormateData({ id: existingCustomer._id, token });
    // }
    UserService.prototype.GetProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.FindUserById(id)];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser) {
                            throw new app_errors_1.ValidationError("No user");
                        }
                        return [2 /*return*/, { data: existingUser }];
                }
            });
        });
    };
    UserService.prototype.CreateUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var shop, email, salt, password, first_name, last_name, role, _id, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shop = data.shop, email = data.email, salt = data.salt, password = data.password, first_name = data.first_name, last_name = data.last_name, role = data.role, _id = data._id, address = data.address;
                        console.log({ data: data });
                        return [4 /*yield*/, this.repository.CreateUser({
                                user_id: _id,
                                shop: shop,
                                address: address,
                                email: email,
                                salt: salt,
                                password: password,
                                first_name: first_name,
                                last_name: last_name,
                                role: role,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.UpdateUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var shop, email, salt, password, first_name, last_name, role, _id, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shop = data.shop, email = data.email, salt = data.salt, password = data.password, first_name = data.first_name, last_name = data.last_name, role = data.role, _id = data._id, address = data.address;
                        return [4 /*yield*/, this.repository.UpdateUser({
                                user_id: _id,
                                shop: shop,
                                address: address,
                                email: email,
                                salt: salt,
                                password: password,
                                first_name: first_name,
                                last_name: last_name,
                                role: role,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.DeleteUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data);
                        return [4 /*yield*/, this.repository.DeleteUser(data)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.UpdateUserProfile = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.UpdateUserProfile(id, data)];
                    case 1:
                        updatedUser = _a.sent();
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    UserService.prototype.UpdateUserPayload = function (user, event) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                if (user) {
                    payload = {
                        event: event,
                        data: { user: user },
                    };
                    return [2 /*return*/, payload];
                }
                else {
                    return [2 /*return*/, (0, utils_1.FormateData)({ error: "No user available" })];
                }
                return [2 /*return*/];
            });
        });
    };
    UserService.prototype.SubscribeEvents = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var event, data, user;
            return __generator(this, function (_a) {
                console.log("Triggering.... User Events");
                payload = JSON.parse(payload);
                event = payload.event, data = payload.data;
                user = data.user;
                switch (event) {
                    case "CREATE_USER":
                        this.CreateUser(user);
                        break;
                    case "UPDATE_USER":
                        this.UpdateUser(user);
                        break;
                    case "DELETE_USER":
                        this.DeleteUser(user);
                }
                return [2 /*return*/];
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
