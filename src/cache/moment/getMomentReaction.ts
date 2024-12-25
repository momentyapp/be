import redis from "cache";

interface GetMomentReactionProps {
  momentId: number;
  emoji: string;
}

export default async function getMomentReaction({
  momentId, emoji
}: GetMomentReactionProps) {
  const result = await redis.hGet(`moment:${momentId}:reaction`, emoji);
  return result;
}
