import db from "db";
import cache from "cache";

import ClientError from "error/ClientError";
import isQueryError from "util/isQueryError";

interface Props {
  userId: number;
  emoji: string | null;
  momentId: number;
}

export default async function react({ userId, emoji, momentId }: Props) {
  // 모멘트 반응 추가
  if (emoji !== null) {
    try {
      await db.moment.react({
        userId,
        momentId,
        emoji,
      });
    } catch (error) {
      if (!(error instanceof Error && isQueryError(error))) throw error;

      // 모멘트가 존재하지 않을 때
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new ClientError("존재하지 않는 모멘트예요.");
      }

      throw error;
    }
  }
  // 모멘트 반응 제거
  else {
    const queryResult = await db.moment.deleteReaction({
      userId,
      momentId,
    });

    // 반응을 취소하지 못했을 때
    if (queryResult[0].affectedRows === 0) {
      throw new ClientError("이미 반응을 취소했어요.");
    }
  }

  // DB에서 조회
  const reactionRows = await db.moment.getReactions({ momentId });
  const reactions: Record<string, number> = {};

  // DB에서 조회한 데이터를 캐시에 저장
  for (const row of reactionRows[0]) reactions[row.emoji] = row.count;
  cache.moment.setReactions({ momentId, reactions });
}
