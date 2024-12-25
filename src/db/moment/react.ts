import { pool } from "db";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface Props {
  userId: number;
  momentId: number;
  emoji: string;
}

/**
 * @description 모멘트에 반응을 추가하거나 수정합니다.
 * @param userId 반응을 추가하는 사용자의 아이디
 * @param momentId 반응을 추가하는 모멘트의 아이디
 * @param emoji 추가할 반응
 * @param conn db 연결 객체
 */
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
