import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface UpsertMomentReactionProps {
  userId: number;
  momentId: number;
  emoji: string;
}

export default async function upsertMomentReaction(
  { userId, momentId, emoji }: UpsertMomentReactionProps,
  conn: Connection = db
) {
  const queryResult = await conn.query<ResultSetHeader>(
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
