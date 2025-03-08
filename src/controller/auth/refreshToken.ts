import { z } from "zod";

import Service from "service";

import type { ApiResponse } from "api";
import type { Token } from "common";
import type { RequestHandler } from "express";

// 요청 body
export const RefreshTokenRequestBody = z.object({
  refreshToken: z.string(),
});

// 응답 body
type ResponseBody = ApiResponse<{
  accessToken: Token;
  refreshToken: Token;
}>;

// 핸들러
const refreshToken: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof RefreshTokenRequestBody>
> = async function (req, res, next) {
  const { refreshToken } = req.body;

  const token = await Service.auth.refreshToken({ refreshToken });

  return res.status(200).json({
    message: "로그인에 성공했어요",
    result: token,
    code: "success",
  });
};

export default refreshToken;
