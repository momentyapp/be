import path from "path";
import Crypto from "crypto";
import { promises as fs } from "fs";

import isQueryError from "util/isQueryError";
import getSaltedHash from "util/getSaltedHash";
import ServerError from "error/ServerError";
import DuplicationError from "error/DuplicationError";

import db, { pool } from "db";

interface Props {
  password: string;
  username: string;
  photo?: Express.Multer.File;
}

export default async function create({ password, username, photo }: Props) {
  // 트랜잭션 시작
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  // 비밀번호 해싱
  const salt = Crypto.randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(password, salt);

  // 프로필 사진 이름 생성
  const photoFilename =
    photo !== undefined
      ? Crypto.randomBytes(20).toString("hex") +
        path.extname(photo.originalname)
      : undefined;

  let queryResult;
  try {
    // 사용자 생성
    queryResult = await db.user.create(
      {
        username,
        hashedPassword,
        salt,
        photo: photoFilename,
      },
      conn
    );

    // 사용자 생성 실패 시
    if (queryResult[0].affectedRows === 0) {
      conn.release();
      throw new ServerError(
        "query",
        "Unable to create user.",
        "사용자를 생성하지 못 했어요."
      );
    }
  } catch (error) {
    conn.release();
    if (!(error instanceof Error && isQueryError(error))) throw error;

    // 중복 에러 처리
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("username"))
        throw new DuplicationError("사용자 이름");
    }

    throw error;
  }

  // 프로필 사진 저장
  if (photoFilename !== undefined && photo !== undefined) {
    try {
      await fs.writeFile(
        path.resolve("files/profile", photoFilename),
        photo.buffer
      );
    } catch (error) {
      // 파일 저장 실패 시 유저 삭제
      await conn.rollback();
      conn.release();

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

  const userId = queryResult[0].insertId;
  return userId;
}
