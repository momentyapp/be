import { NextFunction, Request, Response } from "express";
import debug from "debug";
import { ZodError } from "zod";

export default function zodErrorHandler(
  error: ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    const log = debug(`app:log:client_error`);
    log(error);

    return res
      .status(400)
      .json({ message: error.issues[0].message, code: error.issues[0].code });
  } else {
    return next(error);
  }
}
