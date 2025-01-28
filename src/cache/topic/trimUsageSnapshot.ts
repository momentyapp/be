import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
  count: number;
}

export default async function trimUsageSnapshot({ topicId, count }: Props) {
  const result = await redis.lTrim(
    `topic:${topicId}:usage_snapshots`,
    0,
    count
  );

  return result;
}
