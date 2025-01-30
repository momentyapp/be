import { pool } from "db";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface Props {
  names: string[];
}

interface Row {
  id: number;
  name: string;
}

/**
 * @description 이름 목록에 해당하는 주제들을 조회합니다.
 * @param topicNames 조회할 주제 이름 목록
 * @param conn db 연결 객체
 * @returns
 */
export default async function getByNames(
  { names }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.query<QueryResultRow<Row>[]>(
    `
    SELECT id, name FROM topic WHERE name IN (?)
    `,
    [names]
  );

  return queryResult;
}
