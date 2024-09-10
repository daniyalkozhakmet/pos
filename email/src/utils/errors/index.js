"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (app) {
    app.use(function (error, req, res, next) {
        var reportError = true;
        // // skip common / known errors
        // [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
        //   if (error instanceof typeOfError) {
        //     reportError = false;
        //   }
        // });
        // if (reportError) {
        //   Sentry.captureException(error);
        // }
        console.log({ error: error });
        var statusCode = error.statusCode || 500;
        var data = error.data || error.message;
        return res.status(statusCode).json({ response: { error: data } });
    });
});
