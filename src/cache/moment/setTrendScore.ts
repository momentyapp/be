import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  score: number;
}

export default async function setTrendScore({ momentId, score }: Props) {
  const updatedScore = await redis.zAdd(`moment_trend`, {
    score,
    value: momentId.toString(),
  });
  return updatedScore;
}
