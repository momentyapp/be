import { redisClient as redis } from "cache";

export default async function getTrendings() {
  const topicIds = await redis.zRange(`topic_trend`, 0, 9);
  return topicIds.map((id) => parseInt(id));
}
