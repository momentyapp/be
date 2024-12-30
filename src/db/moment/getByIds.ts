import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  userId?: number;
  momentIds: number[];
}

interface MomentRow {
  id: number;
  createdAt: string;
  expiresAt: string;
  text: string;
  userId: number | null;
  username: string | null;
  userCreatedAt: string | null;
  userPhoto: string | null;
  photos: string | null;
  topicIds: string | null;
  topicNames: string | null;
  emojis: string | null;
  myEmoji: string | null;
}

/**
 * @description 아이디 목록에 해당하는 모멘트들을 조회합니다.
 * @param userId 조회하는 사용자의 아이디
 * @param momentIds 조회할 모멘트 아이디 목록
 * @param conn db 연결 객체
 * @returns
 */
export default async function getByIds(
  { userId, momentIds }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<QueryResultRow<MomentRow>[]>(
    `
    SELECT
      m.id,
      m.createdAt,
      m.expiresAt,
      m.text,
      m.userId,
      u.username,
      u.createdAt AS userCreatedAt,
      u.photo AS userPhoto,
      GROUP_CONCAT(DISTINCT mp.path) AS photos,
      GROUP_CONCAT(DISTINCT t.id) AS topicIds,
      GROUP_CONCAT(DISTINCT t.name) AS topicNames,
      GROUP_CONCAT(
        DISTINCT CONCAT(
          mr.emoji, ':',
          (
            SELECT COUNT(*)
            FROM moment_reaction mr2
            WHERE mr2.momentId = m.id AND mr2.emoji = mr.emoji
          )
        )
      ) AS emojis,
      (
        SELECT mr3.emoji
        FROM moment_reaction mr3
        WHERE mr3.momentId = m.id AND mr3.userId = ?
      ) AS myEmoji
    FROM moment m
      LEFT JOIN user u ON m.userId = u.id
      LEFT JOIN moment_reaction mr ON m.id = mr.momentId
      LEFT JOIN moment_photo mp ON m.id = mp.momentId
      LEFT JOIN moment_topic mt ON m.id = mt.momentId
      LEFT JOIN topic t ON mt.topicId = t.id
    WHERE
      m.id IN (?)
    GROUP BY
      m.id, m.createdAt, m.expiresAt, m.text, m.userId, u.username, u.createdAt, u.photo
    ORDER BY
      m.id DESC
    LIMIT 10
    `,
    [userId ?? null, momentIds.join(",")]
  );

  return queryResult;
}
