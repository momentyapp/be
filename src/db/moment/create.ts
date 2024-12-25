import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  userId?: number;
  expiresIn?: number;
  text: string;
  photos?: string[];
  topicIds?: number[];
}

/**
 * @description 모멘트를 생성합니다.
 * @param userId 모멘트 작성자의 아이디
 * @param expiresIn 모멘트의 유효 시간 (시간)
 * @param text 모멘트 내용
 * @param photos 모멘트 사진 경로 목록
 * @param topicsIds 모멘트 주제 아이디 목록
 * @param conn db 연결 객체
 */
export default async function create(
  { userId, expiresIn, text, photos, topicIds }: Props,
  conn: Connection = pool
) {
  const expiresInMs =
    expiresIn !== undefined ? expiresIn * 60 * 60 * 1000 : null;

  // 모멘트 생성
  const queryResult = await conn.execute<ResultSetHeader>(
    "INSERT INTO moment SET ?",
    {
      userId,
      expiresAt: expiresInMs ? new Date(Date.now() + expiresInMs) : null,
      text,
    }
  );
  const momentId = queryResult[0].insertId;

  const promises = [];

  // 사진 추가
  if (photos !== undefined && photos.length > 0) {
    promises.push(
      conn.query<ResultSetHeader>(
        `INSERT INTO moment_photo (momentId, path) VALUES ?`,
        [photos.map((path) => [momentId, path])]
      )
    );
  }

  // 주제 추가
  if (topicIds !== undefined && topicIds.length > 0) {
    promises.push(
      conn.query<ResultSetHeader>(
        `INSERT INTO moment_topic (momentId, topicId) VALUES ?`,
        [topicIds.map((topicId) => [momentId, topicId])]
      )
    );
  }

  await Promise.all(promises);

  return queryResult;
}
