import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  userId: number;
  momentId: number;
  emoji: string;
}

export default async function react(
  { userId, momentId, emoji }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<ResultSetHeader>(
    `
    INSERT INTO moment_reaction SET ?
    ON DUPLICATE KEY UPDATE
        emoji = VALUES(emoji)
    `,
    {
      userId,
      momentId,
      emoji,
    }
  );

  return queryResult;
}
