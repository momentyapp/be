import path from "path";
import Crypto from "crypto";
import { promises as fs } from "fs";

import db, { pool } from "db";

import isQueryError from "util/isQueryError";

import ServerError from "error/ServerError";
import ClientError from "error/ClientError";
import Service from "service";

interface Props {
  photos?: Express.Multer.File[];
  userId: number;
  text: string;
  topicIds: number[];
  expiresIn?: number;
}

export default async function post({
  photos,
  userId,
  text,
  topicIds,
  expiresIn,
}: Props) {
  // 트랜잭션 시작
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  // 사진 이름 생성
  const photoFilenames =
    photos !== undefined
      ? photos.map(
          (file) =>
            Crypto.randomBytes(20).toString("hex") +
            path.extname(file.originalname)
        )
      : undefined;

  // 모멘트 생성
  let queryResult;
  try {
    queryResult = await db.moment.create(
      {
        userId,
        text,
        topicIds,
        expiresIn,
        photos: photoFilenames,
      },
      conn
    );

    // 모멘트 생성 실패 시
    if (queryResult[0].affectedRows === 0) {
      conn.rollback();
      conn.release();
      throw new ServerError(
        "query",
        "Unable to post moment.",
        "모멘트를 게시하지 못 했어요."
      );
    }
  } catch (error) {
    conn.rollback();
    conn.release();
    if (!(error instanceof Error && isQueryError(error))) throw error;

    // 주제가 존재하지 않을 때
    if (
      error.code === "ER_NO_REFERENCED_ROW_2" &&
      error.message.includes("topicId")
    ) {
      throw new ClientError("존재하지 않는 주제예요.");
    }

    throw error;
  }

  // 사진 저장
  if (photoFilenames !== undefined && photos !== undefined) {
    try {
      for (let i = 0; i < photos.length; i++) {
        await fs.writeFile(
          path.resolve("files/moment", photoFilenames[i]),
          photos[i].buffer
        );
      }
    } catch (error) {
      // 파일 저장 실패 시 모멘트 삭제
      await conn.rollback();
      conn.release();

      throw new ServerError(
        "file",
        "Unable to save moment photo.",
        "사진을 저장하지 못 했어요."
      );
    }
  }

  // 트랜잭션 커밋
  await conn.commit();
  conn.release();

  const momentId = queryResult[0].insertId;
  // 주제 사용 횟수 증가
  topicIds.forEach((topicId) => Service.topic.increaseUsage({ topicId }));
  return momentId;
}
