import { pool } from "db";

import type { Connection } from "mysql2/promise";
import type { QueryResult, QueryResultRow } from "utility";
import type UserRow from "schema/User";

export interface Props {
  id: number;
  password?: string;
}

export default async function getById(
  { id, password }: Props,
  conn: Connection = pool
) {
  let queryResult: QueryResult<UserRow>;

  if (password === undefined) {
    queryResult = await conn.query<QueryResultRow<UserRow>[]>(
      "SELECT * FROM user WHERE ?",
      { id }
    );
  } else {
    queryResult = await conn.query<QueryResultRow<UserRow>[]>(
      "SELECT * FROM user WHERE ? AND ?",
      [{ id }, { password }]
    );
  }

  return queryResult;
}
