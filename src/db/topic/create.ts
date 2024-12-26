import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  name: string;
}

export default async function create({ name }: Props, conn: Connection = pool) {
  const queryResult = await conn.execute<ResultSetHeader>(
    "INSERT INTO topic (name) VALUES (?)",
    [name]
  );

  return queryResult;
}
