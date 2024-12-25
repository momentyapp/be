import cache from "cache";
import db from "db";

interface Props {
  momentId: number;
}

export default async function getReactions({ momentId }: Props) {
  const cachedReactions = await cache.moment.getReactions({ momentId });

  // 캐시가 존재하면 캐시 반환
  if (cachedReactions !== null) return cachedReactions;

  // 캐시가 존재하지 않으면 DB에서 조회
  const reactionRows = await db.moment.getReactions({ momentId });
  const reactions: Record<string, number> = {};

  // DB에서 조회한 데이터를 캐시에 저장
  for (const row of reactionRows[0]) reactions[row.emoji] = row.count;
  cache.moment.setReactions({ momentId, reactions });

  return reactions;
}
