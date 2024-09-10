"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePasswordVerification = void 0;
var Joi = require("joi");
var schema = Joi.object({
    verification_code: Joi.number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .messages({
        "number.base": "Verification code must be a number.",
        "number.min": "Verification code must be exactly 6 digits.",
        "number.max": "Verification code must be exactly 6 digits.",
        "any.required": "Verification code is required.",
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .messages({
        "string.pattern.base": "Password must be between 3 to 30 characters and contain only alphanumeric characters.",
    }),
    email: Joi.string()
        .required()
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    })
        .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email cannot be an empty field.",
    }),
});
var ValidatePasswordVerification = function (req, res, next) {
    var error = schema.validate(req.body, { abortEarly: false }).error;
    if (error) {
        var formattedErrors = error.details.map(function (err) { return ({
            message: err.message,
            path: err.path.join("."),
        }); });
        return res.status(400).json({ response: { error: formattedErrors } });
    }
    next();
};
exports.ValidatePasswordVerification = ValidatePasswordVerification;
