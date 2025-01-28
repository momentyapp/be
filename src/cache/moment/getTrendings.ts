import { redisClient as redis } from "cache";

interface Props {
  start: number;
}

export default async function getTrendings({ start }: Props) {
  const momentIds = await redis.zRange(`moment_trend`, start, 9);
  return momentIds.map((id) => parseInt(id));
}
