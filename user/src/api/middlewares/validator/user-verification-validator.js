"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUserVerification = void 0;
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
    email: Joi.string()
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    })
        .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email cannot be an empty field.",
    }),
});
var ValidateUserVerification = function (req, res, next) {
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
exports.ValidateUserVerification = ValidateUserVerification;
