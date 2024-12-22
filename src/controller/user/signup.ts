import path from "path";
import { z } from "zod";
import { promises as fs } from "fs";
import { randomBytes } from "crypto";

import db from "model";
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
  username: userSchema.username,
  password: userSchema.password,
});

// 응답 body
type ResponseBody = ApiResponse;

// 핸들러
const signup: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof SignupRequestBody>
> = async function (req, res, next) {
  // 트랜잭션 시작
  const conn = await db.getConnection();
  await conn.beginTransaction();

  // 비밀번호 해싱
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(req.body.password, salt);

  // 프로필 사진 이름 생성
  const photoFilename = req.file
    ? `${Date.now()}_${req.file.originalname}`
    : undefined;

  try {
    // 사용자 생성
    const queryResult = await createUser(
      {
        username: req.body.username,
        hashedPassword,
        salt,
        photo:
          photoFilename !== undefined
            ? `/files/profile/${photoFilename}`
            : undefined,
      },
      conn
    );

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
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("username"))
        return next(new DuplicationError("사용자 이름"));
    }

    return next(error);
  }

  // 프로필 사진 저장
  if (photoFilename !== undefined && req.file) {
    try {
      await fs.writeFile(
        path.resolve("files/profile", photoFilename),
        req.file.buffer
      );
    } catch (error) {
      // 파일 저장 실패 시 유저 삭제
      await conn.rollback();

      return new ServerError(
        "file",
        "Unable to save profile photo.",
        "프로필 사진을 저장하지 못 했어요."
      );
    }
  }

  // 트랜잭션 커밋
  await conn.commit();
  conn.release();

  return res.status(200).json({
    message: "사용자가 생성됐어요.",
    code: "success",
  });
};

export default signup;
