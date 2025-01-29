import { redisClient as redis } from "cache";

export default async function getTrendings() {
  const topicIds = await redis.sendCommand<string[]>([
    "ZREVRANGE",
    "topic_trend",
    "0",
    "9",
  ]);
  return topicIds.map((id) => parseInt(id));
}
