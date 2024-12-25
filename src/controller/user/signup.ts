import { z } from "zod";

import userZod from "zod/user";

import services from "services";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const SignupRequestBody = z.object({
  username: userZod.username,
  password: userZod.password,
});

// 응답 body
type ResponseBody = ApiResponse;

// 핸들러
const signup: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof SignupRequestBody>
> = async function (req, res, next) {
  const { file: photo } = req;
  const { username, password } = req.body;

  await services.user.create({
    username,
    password,
    photo,
  });

  return res.status(200).json({
    message: "사용자가 생성됐어요.",
    code: "success",
  });
};

export default signup;
