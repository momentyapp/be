import jwt from "jsonwebtoken";

import db from "db";
import Service from "service";

import ServerError from "error/ServerError";
import ExpiredTokenError from "error/ExpiredTokenError";
import InvalidTokenError from "error/InvalidTokenError";
import NotFoundError from "error/NotFoundError";

import type { User } from "common";
interface Props {
  refreshToken: string;
}

export default function refreshToken({ refreshToken }: Props): Promise<{
  token: ReturnType<typeof Service.auth.createToken>;
  user: User;
}> {
  return new Promise((resolve, reject) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // JWT_SECRET_KEY가 없을 경우
    if (jwtSecretKey === undefined)
      return reject(new ServerError("env", "Unable to load `JWT_SECRET_KEY`"));

    // JWT 토큰 검증
    jwt.verify(refreshToken, jwtSecretKey, async (error, decodedJwt) => {
      // 오류 발생 시
      if (error) {
        if (error instanceof jwt.TokenExpiredError)
          return reject(new ExpiredTokenError("사용자 토큰"));
        return reject(new InvalidTokenError("사용자 토큰"));
      }

      // 토큰의 타입이 object가 아니거나 userId가 number가 아닐 경우
      if (
        typeof decodedJwt !== "object" ||
        typeof decodedJwt.userId !== "number"
      )
        return reject(new InvalidTokenError("사용자 토큰"));

      // 사용자가 존재하는지 확인
      const userId = decodedJwt.userId;
      const userRow = await db.user.getById({ id: userId });
      if (userRow[0].length !== 1) throw new NotFoundError("사용자");

      const user = Service.user.convertRows({ userRows: userRow[0] })[0];

      // JWT 토큰 생성
      const token = Service.auth.createToken({ id: userId });
      resolve({ token, user });
    });
  });
}
