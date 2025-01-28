import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  topicIds: number[];
}

interface Row {
  id: number;
  name: string;
}

/**
 * @description 아이디 목록에 해당하는 주제들을 조회합니다.
 * @param topicIds 조회할 주제 아이디 목록
 * @param conn db 연결 객체
 * @returns
 */
export default async function getByIds(
  { topicIds }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<QueryResultRow<Row>[]>(
    `
    SELECT id, name FROM topic WHERE id IN (?)
    `,
    [topicIds.join(",")]
  );

  return queryResult;
}
