import { Request, Response, NextFunction } from "express";
import ClientError from "error/ClientError";
import debug from "debug";

export default function userErrorHandler(
  error: ClientError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ClientError) {
    const log = debug(`app:log:client_error`);
    log(error);

    return res
      .status(error.statusCode)
      .json({ message: error.message, code: error.errorCode });
  } else {
    return next(error);
  }
}
