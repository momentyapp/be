import path from "path";
import Crypto from "crypto";
import { z } from "zod";
import { promises as fs } from "fs";

import db from "model";
import createMoment from "model/moment/createMoment";

import isQueryError from "util/isQueryError";

import ServerError from "error/ServerError";

import momentSchema from "schema/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import ClientError from "error/ClientError";

// 요청 body
export const PostMomentRequestBody = z.object({
  text: momentSchema.text,
  topicIds: momentSchema.topicIds,
  expiresIn: momentSchema.expiresIn,
});

// 응답 body
type ResponseBody = ApiResponse<{
  momentId: number;
}>;

// 핸들러
const postMoment: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof PostMomentRequestBody>
> = async function (req, res, next) {
  // 트랜잭션 시작
  const conn = await db.getConnection();
  await conn.beginTransaction();

  // 사진 이름 생성
  const photoFilenames = Array.isArray(req.files)
    ? req.files.map(
        (file) =>
          Crypto.randomBytes(20).toString("hex") +
          path.extname(file.originalname)
      )
    : undefined;

  try {
    // 모멘트 생성
    const queryResult = await createMoment(
      {
        userId: req.userId,
        text: req.body.text,
        topicsIds: JSON.parse(req.body.topicIds),
        expiresIn: Number(req.body.expiresIn),
        photos: photoFilenames,
      },
      conn
    );

    // 모멘트 생성 실패 시
    if (queryResult[0].affectedRows === 0)
      throw new ServerError(
        "query",
        "Unable to post moment.",
        "모멘트를 게시하지 못 했어요."
      );
  } catch (error) {
    if (!(error instanceof Error && isQueryError(error))) return next(error);

    // 중복 에러 처리
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return next(new ClientError("존재하지 않는 주제예요."));
    }

    return next(error);
  }

  // 사진 저장
  if (photoFilenames !== undefined && Array.isArray(req.files)) {
    try {
      for (let i = 0; i < req.files.length; i++) {
        await fs.writeFile(
          path.resolve("files/moment", photoFilenames[i]),
          req.files[i].buffer
        );
      }
    } catch (error) {
      // 파일 저장 실패 시 모멘트 삭제
      await conn.rollback();

      return new ServerError(
        "file",
        "Unable to save moment photo.",
        "사진을 저장하지 못 했어요."
      );
    }
  }

  // 트랜잭션 커밋
  await conn.commit();
  conn.release();

  return res.status(200).json({
    message: "모멘트가 게시됐어요.",
    code: "success",
  });
};

export default postMoment;
