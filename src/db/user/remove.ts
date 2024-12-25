import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  id?: number;
  username?: string;
  password: string;
}

export default async function remove(
  { id, username, password }: Props,
  conn: Connection = pool
) {
  if (id === undefined && username === undefined) {
    throw new Error("At least one of id or username must be provided.");
  }

  const queryResult = await conn.execute<ResultSetHeader>(
    "DELETE FROM user WHERE id = ? OR username = ? AND password = ?",
    [id, username, password]
  );

  return queryResult;
}
