import redis from "cache";

interface DecreaseMomentReactionProps {
  momentId: number;
  emoji: string;
}

export default async function decreaseMomentReaction({
  momentId,
  emoji,
}: DecreaseMomentReactionProps) {
  if ((await redis.exists(`moment:${momentId}:reaction`)) === 0) return false;

  await Promise.all([
    redis.hIncrBy(`moment:${momentId}:reaction`, emoji, -1),
    redis.hIncrBy(`moment:${momentId}:reaction`, "total", -1),
  ]);

  return true;
}
