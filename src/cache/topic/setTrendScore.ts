import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
  score: number;
}

export default async function setTrendScore({ topicId, score }: Props) {
  const updatedScore = await redis.zAdd(`topic_trend`, {
    score,
    value: topicId.toString(),
  });
  return updatedScore;
}
