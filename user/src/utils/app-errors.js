"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.BadRequestError = exports.APIError = exports.AppError = exports.STATUS_CODES = void 0;
exports.STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, description) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = name;
        _this.statusCode = statusCode;
        _this.isOperational = isOperational;
        _this.errorStack = errorStack;
        _this.logError = logingErrorResponse;
        Error.captureStackTrace(_this);
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
//api Specific Errors
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(name, statusCode, description, isOperational) {
        if (statusCode === void 0) { statusCode = exports.STATUS_CODES.INTERNAL_ERROR; }
        if (description === void 0) { description = "Internal Server Error"; }
        if (isOperational === void 0) { isOperational = true; }
        return _super.call(this, name, statusCode, description, isOperational, null, null) || this;
    }
    return APIError;
}(AppError));
exports.APIError = APIError;
//400
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(description, logingErrorResponse) {
        if (description === void 0) { description = "Bad request"; }
        return _super.call(this, "NOT FOUND", exports.STATUS_CODES.BAD_REQUEST, description, true, false, logingErrorResponse) || this;
    }
    return BadRequestError;
}(AppError));
exports.BadRequestError = BadRequestError;
//400
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(description, errorStack) {
        if (description === void 0) { description = "Validation Error"; }
        return _super.call(this, "BAD REQUEST", exports.STATUS_CODES.BAD_REQUEST, description, true, errorStack, null) || this;
    }
    return ValidationError;
}(AppError));
exports.ValidationError = ValidationError;
