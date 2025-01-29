import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
}

export default async function getTrendRank({ topicId }: Props) {
  const rank = await redis.zRevRank(`topic_trend`, topicId.toString());
  return rank;
}
