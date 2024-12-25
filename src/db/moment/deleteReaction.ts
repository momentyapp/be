import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  userId: number;
  momentId: number;
}

/**
 * @description 모멘트의 반응을 삭제합니다.
 * @param userId 반응을 삭제할 사용자의 아이디
 * @param momentId 반응을 삭제할 모멘트의 아이디
 * @param conn db 연결 객체
 */
export default async function deleteReaction(
  { userId, momentId }: Props,
  conn: Connection = pool
) {
  const queryResult = await conn.execute<ResultSetHeader>(
    `DELETE FROM moment_reaction WHERE userId = ? AND momentId = ?`,
    [userId, momentId]
  );

  return queryResult;
}
