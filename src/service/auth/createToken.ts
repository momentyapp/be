import jwt from "jsonwebtoken";

import ServerError from "error/ServerError";

interface Props {
  id: number;
}

export default function createToken({ id }: Props) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  // JWT_SECRET_KEY가 없을 경우
  if (jwtSecretKey === undefined)
    throw new ServerError("env", "Unable to load `JWT_SECRET_KEY`");

  // JWT 토큰 생성
  const accessToken = jwt.sign({ userId: id }, jwtSecretKey, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ userId: id }, jwtSecretKey, {
    expiresIn: "60d",
  });

  return {
    accessToken: {
      token: accessToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    refreshToken: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000).toISOString(),
    },
  };
}
