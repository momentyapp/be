import db from "model";

import type { Connection } from "mysql2/promise";

import type { QueryResultRow } from "utility";

export interface SelectMomentReactionsProps {
  momentId: number;
}

interface MomentReactionCountsRow {
  emoji: string;
  count: number;
}

export default async function selectMomentReactions(
  { momentId }: SelectMomentReactionsProps,
  conn: Connection = db
) {
  const queryResult = await conn.query<
    QueryResultRow<MomentReactionCountsRow>[]
  >(
    `
    SELECT
      emoji,
      COUNT(*) as count
    FROM
      moment_reaction
    WHERE 
      momentId = ?
    GROUP BY
      emoji
    `,
    [momentId]
  );

  return queryResult;
}
