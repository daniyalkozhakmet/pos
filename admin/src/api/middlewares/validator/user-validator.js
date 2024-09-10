"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUser = void 0;
var Joi = require("joi");
var schema = Joi.object({
    last_name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Last name should be a type of text.",
        "string.alphanum": "Last name must only contain alphanumeric characters.",
        "string.empty": "Last name cannot be an empty field.",
        "string.min": "Last name should have a minimum length of {#limit}.",
        "string.max": "Last name should have a maximum length of {#limit}.",
        "any.required": "Last name is a required field.",
    }),
    first_name: Joi.string().min(3).max(30).required().messages({
        "string.base": "First name should be a type of text.",
        "string.alphanum": "First name must only contain alphanumeric characters.",
        "string.empty": "First name cannot be an empty field.",
        "string.min": "First name should have a minimum length of {#limit}.",
        "string.max": "First name should have a maximum length of {#limit}.",
        "any.required": "First name is a required field.",
    }),
    address: Joi.string().min(3).max(30).required().messages({
        "string.base": "Address should be a type of text.",
        "string.alphanum": "Address must only contain alphanumeric characters.",
        "string.empty": "Address cannot be an empty field.",
        "string.min": "Address should have a minimum length of {#limit}.",
        "string.max": "Address should have a maximum length of {#limit}.",
        "any.required": "Address is a required field.",
    }),
    shop: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.base": "Shop name should be a type of text.",
        "string.alphanum": "Shop name must only contain alphanumeric characters.",
        "string.empty": "Shop name cannot be an empty field.",
        "string.min": "Shop name should have a minimum length of {#limit}.",
        "string.max": "Shop name should have a maximum length of {#limit}.",
        "any.required": "Shop name is a required field.",
    }),
    role: Joi.string().min(3).max(30).required().messages({
        "string.base": "Role should be a type of text.",
        "string.alphanum": "Role must only contain alphanumeric characters.",
        "string.empty": "Role cannot be an empty field.",
        "string.min": "Role should have a minimum length of {#limit}.",
        "string.max": "Role should have a maximum length of {#limit}.",
        "any.required": "Role is a required field.",
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
        "string.pattern.base": "Password must be between 3 to 30 characters and contain only alphanumeric characters.",
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
var ValidateUser = function (req, res, next) {
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
exports.ValidateUser = ValidateUser;
