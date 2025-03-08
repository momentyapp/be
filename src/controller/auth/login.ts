import { z } from "zod";

import Service from "service";

import userZod from "zod/user";

import type { ApiResponse } from "api";
import type { Token, User } from "common";
import type { RequestHandler } from "express";

// 요청 body
export const LoginRequestBody = z.object({
  username: userZod.username,
  password: userZod.password,
});

// 응답 body
type ResponseBody = ApiResponse<{
  user: User;
  accessToken: Token;
  refreshToken: Token;
}>;

// 핸들러
const login: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof LoginRequestBody>
> = async function (req, res, next) {
  const { username, password } = req.body;

  const user = await Service.user.get({ username, plainPassword: password });

  if (user === null) {
    return res.status(400).json({
      message: "사용자 이름 또는 비밀번호가 틀렸어요.",
      code: "invalid_username_or_password",
    });
  }

  const token = Service.auth.createToken({ id: user.id });

  return res.status(200).json({
    message: "로그인에 성공했어요",
    result: {
      user,
      ...token,
    },
    code: "success",
  });
};

export default login;
