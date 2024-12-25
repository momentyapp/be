import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  topicIds: number[];
  before?: number;
  userId?: number;
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
 * @description 주제에 해당하는 모멘트를 조회합니다.
 * @param topicIds 조회할 주제 아이디 목록
 * @param before 조회할 모멘트의 아이디의 상한선
 * @param userId 조회하는 사용자의 아이디
 * @param conn db 연결 객체
 * @returns
 */
export default async function getByTopics(
  { topicIds, before, userId }: Props,
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
      u.createdAt as userCreatedAt,
      u.photo as userPhoto,
      GROUP_CONCAT(DISTINCT mp.path) as photos,
      GROUP_CONCAT(DISTINCT t.id) as topicIds,
      GROUP_CONCAT(DISTINCT t.name) as topicNames,
      GROUP_CONCAT(DISTINCT CONCAT(mr.emoji, ':', (
        SELECT COUNT(*) 
        FROM moment_reaction mr2 
        WHERE mr2.momentId = m.id AND mr2.emoji = mr.emoji
      ))) as emojis,
      (
        SELECT mr3.emoji
        FROM moment_reaction mr3
        WHERE mr3.momentId = m.id AND mr3.userId = ?
      ) as myEmoji
    FROM 
      moment m
      LEFT JOIN user u ON m.userId = u.id
      LEFT JOIN moment_reaction mr ON m.id = mr.momentId
      LEFT JOIN moment_photo mp ON m.id = mp.momentId
      LEFT JOIN moment_topic mt ON m.id = mt.momentId
      LEFT JOIN topic t ON mt.topicId = t.id
    WHERE 
      t.id IN (?) AND m.id < ?
    GROUP BY 
      m.id, m.createdAt, m.expiresAt, m.text, m.userId, u.username, u.createdAt, u.photo
    ORDER BY 
      m.id DESC
    LIMIT 10
    `,
    [userId || null, topicIds, before ?? 2147483647]
  );

  return queryResult;
}
