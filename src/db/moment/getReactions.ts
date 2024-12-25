import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

interface Props {
  momentId: number;
}

interface Row {
  emoji: string;
  count: number;
}

/**
 * @description 모멘트의 반응을 조회합니다.
 * @param momentId 반응을 조회할 모멘트의 아이디
 * @param conn db 연결 객체
 */
export default async function getReactions(
  { momentId }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<QueryResultRow<Row>[]>(
    `
    SELECT
      emoji,
      COUNT(*) as count
    FROM
      moment_reaction
    WHERE 
      momentId = ?
    GROUP BY
      emoji
    `,
    [momentId]
  );

  return queryResult;
}
