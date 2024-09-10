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
exports.SubscribeMessage = exports.PublishMessage = exports.CreateChannel = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = exports.FormateData = exports.ValidateSignatureRefresh = exports.ValidateSignatureJWT = exports.ValidateSignatureCookie = void 0;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var amqplib = require("amqplib");
var config_1 = require("../config");
var ValidateSignatureCookie = function (req) {
    try {
        var token = req.cookies.token;
        if (token) {
            var decoded = jwt.verify(token, config_1.APP_SECRET); // Synchronously verify the token
            if (decoded.role == "super") {
                req.user = decoded;
                return true;
            }
            // Attach decoded payload to request object
            return false;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.ValidateSignatureCookie = ValidateSignatureCookie;
var ValidateSignatureJWT = function (req, token) {
    try {
        if (token) {
            var decoded = jwt.verify(token, config_1.APP_SECRET); // Synchronously verify the token
            if (decoded.role == "super") {
                req.user = decoded;
                return true;
            }
            // Attach decoded payload to request object
            return false;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.ValidateSignatureJWT = ValidateSignatureJWT;
var ValidateSignatureRefresh = function (req) {
    try {
        var token = req.cookies["refresh-token"];
        if (token) {
            var decoded = jwt.verify(token, config_1.APP_SECRET); // Synchronously verify the token
            if (decoded.role == "super") {
                return token;
            }
        }
        return null;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
exports.ValidateSignatureRefresh = ValidateSignatureRefresh;
var FormateData = function (data) {
    if (data) {
        return { data: data };
    }
    else {
        throw new Error("Data Not found!");
    }
};
exports.FormateData = FormateData;
var GenerateSalt = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt.genSalt()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GenerateSalt = GenerateSalt;
var GeneratePassword = function (password, salt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GeneratePassword = GeneratePassword;
var ValidatePassword = function (enteredPassword, savedPassword, salt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.GeneratePassword)(enteredPassword, salt)];
            case 1: return [2 /*return*/, (_a.sent()) === savedPassword];
        }
    });
}); };
exports.ValidatePassword = ValidatePassword;
// export const GenerateSignature = async (payload: JWTSignuture) => {
//   try {
//     return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
//Message Broker
var CreateChannel = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, channel, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, amqplib.connect(config_1.MSG_QUEUE_URL)];
            case 1:
                connection = _a.sent();
                return [4 /*yield*/, connection.createChannel()];
            case 2:
                channel = _a.sent();
                return [4 /*yield*/, channel.assertQueue(config_1.EXCHANGE_NAME, { durable: true })];
            case 3:
                _a.sent();
                return [2 /*return*/, channel];
            case 4:
                err_1 = _a.sent();
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.CreateChannel = CreateChannel;
var PublishMessage = function (channel, service, msg) {
    channel.publish(config_1.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
};
exports.PublishMessage = PublishMessage;
var SubscribeMessage = function (channel, service) { return __awaiter(void 0, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, channel.assertExchange(config_1.EXCHANGE_NAME, "direct", { durable: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, channel.assertQueue("", { exclusive: true })];
            case 2:
                q = _a.sent();
                console.log(" Waiting for messages in queue: ".concat(q.queue));
                channel.bindQueue(q.queue, config_1.EXCHANGE_NAME, config_1.ADMIN_SERVICE);
                channel.consume(q.queue, function (msg) {
                    if (msg.content) {
                        console.log("the message is:", msg.content.toString());
                        service.SubscribeEvents(msg.content.toString());
                    }
                    console.log("[X] received");
                }, {
                    noAck: true,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.SubscribeMessage = SubscribeMessage;
// export const SubscribeMessage = async (channel, service) => {
//   await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
//   const q = await channel.assertQueue("", { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);
//   channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_SERVICE);
//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         console.log("the message is:", msg.content.toString());
//         service.SubscribeEvents(msg.content.toString());
//       }
//       console.log("[X] received");
//     },
//     {
//       noAck: true,
//     }
//   );
// };
