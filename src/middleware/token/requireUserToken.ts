import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import MissingHeaderError from "error/MissingHeaderError";
import InvalidTokenError from "error/InvalidTokenError";
import ServerError from "error/ServerError";
import ExpiredTokenError from "error/ExpiredTokenError";

export default function requireUserToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  // 헤더에 Authorization이 없을 경우
  if (token === undefined) return next(new MissingHeaderError("Authorization"));

  // JWT_SECRET_KEY가 없을 경우
  if (jwtSecretKey === undefined)
    return next(new ServerError("env", "Unable to load `JWT_SECRET_KEY`"));

  // JWT 토큰 검증
  jwt.verify(token, jwtSecretKey, (error, decodedJwt) => {
    // 오류 발생 시
    if (error) {
      if (error instanceof jwt.TokenExpiredError)
        return next(new ExpiredTokenError("사용자 토큰"));
      else return next(new InvalidTokenError("사용자 토큰"));
    }

    // 토큰의 타입이 object가 아니거나 userId가 number가 아닐 경우
    if (typeof decodedJwt !== "object" || typeof decodedJwt.userId !== "number")
      return next(new InvalidTokenError("사용자 토큰"));

    req.userId = decodedJwt.userId;
    return next();
  });
}
