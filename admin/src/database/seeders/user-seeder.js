"use strict";
// seeders/admin-seeder.js
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
var mongoose_1 = require("mongoose");
var User_1 = require("../models/User");
var UserUser_1 = require("./model/UserUser");
var interfaces_1 = require("../../utils/interfaces");
var utils_1 = require("../../utils");
var config_1 = require("../../config");
function seedUserAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var existingAdmin, adminCredentials, salt, hashedPassword, existingUser, existingUserAdmin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Connect to the database
                    console.log("Connecting");
                    return [4 /*yield*/, mongoose_1.default.connect(config_1.DB_URL_ADMIN_SEED, {})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, User_1.default.findOne({ role: interfaces_1.UserRole.SUPER })];
                case 2:
                    existingAdmin = _a.sent();
                    if (!!existingAdmin) return [3 /*break*/, 7];
                    adminCredentials = {
                        email: "admin",
                        first_name: "Admin User",
                        last_name: "Admin User",
                        password: "admin",
                        role: interfaces_1.UserRole.SUPER,
                        address: "Adress",
                        // Add other fields as needed
                    };
                    return [4 /*yield*/, (0, utils_1.GenerateSalt)()];
                case 3:
                    salt = _a.sent();
                    return [4 /*yield*/, (0, utils_1.GeneratePassword)(adminCredentials.password, salt)];
                case 4:
                    hashedPassword = _a.sent();
                    adminCredentials.password = hashedPassword;
                    return [4 /*yield*/, User_1.default.create(__assign(__assign({}, adminCredentials), { salt: salt }))];
                case 5:
                    existingUser = _a.sent();
                    console.log({ existingAdmin: existingUser._doc });
                    console.log("Admin user in ADMIN SERVICE created successfully");
                    existingUserAdmin = {
                        user_id: existingUser._doc._id.toString(),
                        password: existingUser._doc.password,
                        first_name: existingUser._doc.first_name,
                        last_name: existingUser._doc.last_name,
                        address: existingUser._doc.address,
                        role: existingUser._doc.role,
                        salt: existingUser._doc.salt,
                        email: existingUser._doc.email,
                    };
                    mongoose_1.default.disconnect();
                    return [4 /*yield*/, seedUserUser(existingUserAdmin)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Admin user already exists");
                    _a.label = 8;
                case 8: 
                // Close the database connection
                return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 9:
                    // Close the database connection
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function seedUserUser(adminCredentials) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.connect(config_1.DB_URL_USER_SEED, {})];
                case 1:
                    _a.sent();
                    console.log({ adminCredentials: adminCredentials });
                    // Create admin user
                    return [4 /*yield*/, UserUser_1.default.create(adminCredentials)];
                case 2:
                    // Create admin user
                    _a.sent();
                    console.log("Admin user in USER SERVICE created successfully");
                    // Close the database connection
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 3:
                    // Close the database connection
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Execute the admin seeder
seedUserAdmin()
    .then(function () {
    console.log("Admin seeding completed");
    process.exit(0);
})
    .catch(function (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
});
