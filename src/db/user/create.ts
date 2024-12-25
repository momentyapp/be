import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  username: string;
  hashedPassword: string;
  salt: string;
  photo?: string;
}

export default async function create(
  { username, hashedPassword, salt, photo }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<ResultSetHeader>(
    "INSERT INTO user SET ?",
    {
      username,
      password: hashedPassword,
      salt,
      photo,
    }
  );

  return queryResult;
}
