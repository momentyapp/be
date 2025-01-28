import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
}

export default async function increaseUsage({ topicId }: Props) {
  const usage = await redis.hIncrBy(`topic_usage`, topicId.toString(), 1);

  return usage;
}
