import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
}

export default async function getTrendRank({ topicId }: Props) {
  const rank = await redis.zRank(`topic_trend`, topicId.toString());
  return rank;
}
