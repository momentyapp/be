import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface CreateUserProps {
  username: string;
  hashedPassword: string;
  salt: string;
  photo?: string;
}

export default async function createUser(
  { username, hashedPassword, salt, photo }: CreateUserProps,
  conn: Connection = db
) {
  const queryResult = await db.query<ResultSetHeader>(
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
