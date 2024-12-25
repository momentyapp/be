import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  topicIds: number[];
  before: number;
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
  photos: string;
  topicIds: string;
  topicNames: string;
}

export default async function getByTopics(
  { topicIds, before }: Props,
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
      GROUP_CONCAT(DISTINCT t.name) as topicNames
    FROM 
      moment m
      LEFT JOIN user u ON m.userId = u.id
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
    [topicIds, before]
  );

  return queryResult;
}
