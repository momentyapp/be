import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  count: number;
}

export default async function trimReactionSnapshot({ momentId, count }: Props) {
  const result = await redis.lTrim(
    `moment:${momentId}:reaction_snapshot`,
    0,
    count
  );

  return result;
}
