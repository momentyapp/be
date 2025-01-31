import { redisClient as redis } from "cache";
import CryptoJS from "crypto-js";

interface Props {
  text: string;
  topics: string[];
}

export default async function saveTopicRecommendation({ text, topics }: Props) {
  const key = CryptoJS.MD5(text).toString();

  for (const topic of topics) {
    await redis.rPush(`topic_recommendation:${key}`, topic);
  }
  await redis.expire(`topic_recommendation:${key}`, 60 * 60);

  return;
}
