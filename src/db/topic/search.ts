import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  query: string;
}

interface Row {
  id: number;
  name: string;
}

/**
 * @description 주제를 검색합니다.
 * @param topicIds 조회할 주제 아이디 목록
 * @param conn db 연결 객체
 * @returns
 */
export default async function search(
  { query }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<QueryResultRow<Row>[]>(
    `
    SELECT id, name FROM topic WHERE name LIKE ?
    `,
    [query]
  );

  return queryResult;
}
