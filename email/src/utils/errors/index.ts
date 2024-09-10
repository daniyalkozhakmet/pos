import { Express, NextFunction, Request, Response } from "express";

export default (app: Express) => {
  app.use((error, req: Request, res: Response, next: NextFunction) => {
    let reportError = true;

    // // skip common / known errors
    // [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
    //   if (error instanceof typeOfError) {
    //     reportError = false;
    //   }
    // });

    // if (reportError) {
    //   Sentry.captureException(error);
    // }
    console.log({ error });

    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json({ response: { error: data } });
  });
};
