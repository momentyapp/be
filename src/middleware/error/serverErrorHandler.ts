import { Request, Response, NextFunction } from "express";
import debug from "debug";

import ServerError from "error/ServerError";

export default function serverErrorHandler(
  error: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ServerError) {
    const log = debug(`app:error:${error.type}`);
    log(error);

    return res
      .status(500)
      .json({ message: error.message, code: "server_error" });
  } else {
    return next(error);
  }
}
