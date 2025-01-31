import { redisClient as redis } from "cache";
import CryptoJS from "crypto-js";

interface Props {
  text: string;
}

export default async function getTopicRecommendation({ text }: Props) {
  const key = CryptoJS.MD5(text).toString();
  const result = await redis.lRange(`topic_recommendation:${key}`, 0, -1);
  return result;
}
