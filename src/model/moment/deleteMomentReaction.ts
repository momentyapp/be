import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface DeleteMomentReactionProps {
  userId: number;
  momentId: number;
}

export default async function deleteMomentReaction(
  { userId, momentId }: DeleteMomentReactionProps,
  conn: Connection = db
) {
  const queryResult = await conn.query<ResultSetHeader>(
    `DELETE FROM moment_reaction WHERE userId = ? AND momentId = ?`,
    [userId, momentId]
  );

  return queryResult;
}
