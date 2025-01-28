import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
}

export default async function getUsage({ topicId }: Props) {
  const usage = (await redis.hGet(`topic_usage`, topicId.toString())) ?? "0";
  return parseInt(usage);
}
