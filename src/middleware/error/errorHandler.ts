import { Request, Response, NextFunction } from "express";
import debug from "debug";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const log = debug("app:error:unexpected");
  log(error);

  return res.status(500).json({
    message: "서버에서 알 수 없는 오류가 발생했어요.",
    code: "unexpected_server_error",
  });
}
