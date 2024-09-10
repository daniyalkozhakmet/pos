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
exports.NotFoundError = exports.AuthorizeError = exports.ValidationError = exports.APIError = exports.BaseError = exports.STATUS_CODES = void 0;
exports.STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(name, statusCode, description) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, description) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = name;
        _this.statusCode = statusCode;
        Error.captureStackTrace(_this);
        return _this;
    }
    return BaseError;
}(Error));
exports.BaseError = BaseError;
// 500 Internal Error
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(description) {
        if (description === void 0) { description = "api error"; }
        return _super.call(this, "api internal server error", exports.STATUS_CODES.INTERNAL_ERROR, description) || this;
    }
    return APIError;
}(BaseError));
exports.APIError = APIError;
// 400 Validation Error
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(description) {
        if (description === void 0) { description = "bad request"; }
        return _super.call(this, "bad request", exports.STATUS_CODES.BAD_REQUEST, description) || this;
    }
    return ValidationError;
}(BaseError));
exports.ValidationError = ValidationError;
// 403 Authorize error
var AuthorizeError = /** @class */ (function (_super) {
    __extends(AuthorizeError, _super);
    function AuthorizeError(description) {
        if (description === void 0) { description = "access denied"; }
        return _super.call(this, "access denied", exports.STATUS_CODES.UN_AUTHORISED, description) || this;
    }
    return AuthorizeError;
}(BaseError));
exports.AuthorizeError = AuthorizeError;
// 404 Not Found
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(description) {
        if (description === void 0) { description = "not found"; }
        return _super.call(this, "not found", exports.STATUS_CODES.NOT_FOUND, description) || this;
    }
    return NotFoundError;
}(BaseError));
exports.NotFoundError = NotFoundError;
