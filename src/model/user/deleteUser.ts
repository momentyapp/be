import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface DeleteUserProps {
  id?: number;
  username?: string;
  password: string;
}

export default async function deleteUser(
  { id, username, password }: DeleteUserProps,
  conn: Connection = db
) {
  if (id === undefined && username === undefined) {
    throw new Error("At least one of id or username must be provided.");
  }

  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM user WHERE id = ? OR username = ? AND password = ?",
    [id, username, password]
  );

  return queryResult;
}
