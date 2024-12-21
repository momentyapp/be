import { randomBytes } from "crypto";
import MysqlErrorKeys from "mysql-error-keys";
import { z } from "zod";

import createUser from "model/user/createUser";

import DuplicationError from "error/DuplicationError";
import ServerError from "error/ServerError";

import getSaltedHash from "util/getSaltedHash";
import isQueryError from "util/isQueryError";

import userSchema from "schema/user";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const SignupRequestBody = z.object({
  email: userSchema.email,
  password: userSchema.password,
  name: userSchema.name,
});

// 응답 body
type ResponseBody = ApiResponse;

// 핸들러
const signup: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof SignupRequestBody>
> = async function (req, res, next) {
  // 비밀번호 해싱
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(req.body.password, salt);

  try {
    // 사용자 생성
    const queryResult = await createUser({
      email: req.body.email,
      name: req.body.name,
      hashedPassword,
      salt,
    });

    // 사용자 생성 실패 시
    if (queryResult[0].affectedRows === 0)
      throw new ServerError(
        "query",
        "Unable to create user.",
        "사용자를 생성하지 못 했어요."
      );
  } catch (error) {
    if (!(error instanceof Error && isQueryError(error))) return next(error);

    // 중복 에러 처리
    if (error.code === MysqlErrorKeys.ER_DUP_ENTRY) {
      if (error.message.includes("email")) {
        return next(new DuplicationError("이메일"));
      } else if (error.message.includes("name")) {
        return next(new DuplicationError("이름"));
      }
    }

    return next(error);
  }

  return res.status(200).json({
    message: "사용자가 생성됐어요.",
    code: "success",
  });
};

export default signup;
