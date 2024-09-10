"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var email_service_1 = require("../services/email-service");
var utils_1 = require("../utils");
exports.default = (function (app, channel) {
    var service = new email_service_1.EmailService();
    (0, utils_1.SubscribeMessage)(channel, service);
});
