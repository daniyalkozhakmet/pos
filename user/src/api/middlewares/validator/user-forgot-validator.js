"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUserForgot = void 0;
var Joi = require("joi");
var schema = Joi.object({
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
var ValidateUserForgot = function (req, res, next) {
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
exports.ValidateUserForgot = ValidateUserForgot;
