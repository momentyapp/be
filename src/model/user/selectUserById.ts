import db from "model";

import type { Connection } from "mysql2/promise";

import type { UserRow } from "db";
import type { QueryResult, QueryResultRow } from "utility";

export interface GetUserByIdProps {
  id: number;
  password?: string;
}

export default async function getUserById(
  { id, password }: GetUserByIdProps,
  conn: Connection = db
) {
  let queryResult: QueryResult<UserRow>;

  if (password === undefined) {
    queryResult = await db.query<QueryResultRow<UserRow>[]>(
      "SELECT * FROM user WHERE ?",
      { id }
    );
  } else {
    queryResult = await db.query<QueryResultRow<UserRow>[]>(
      "SELECT * FROM user WHERE ? AND ?",
      [{ id }, { password }]
    );
  }

  return queryResult;
}
