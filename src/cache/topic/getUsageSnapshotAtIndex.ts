import { redisClient as redis } from "cache";

interface Props {
  topicId: number;
  index: number;
}

export default async function getUsageSnapshotAtIndex({
  topicId,
  index,
}: Props) {
  const result = await redis.lIndex(`topic:${topicId}:usage_snapshot`, index);
  if (result === null) return null;

  const [timestamp, usage] = result.split(":").map((x) => parseInt(x));
  if (isNaN(timestamp) || isNaN(usage)) return null;
  return { timestamp, usage };
}
