import Cache, { redisClient as redis } from "cache";

interface Props {
  momentId: number;
}

export default async function decreaseReaction({ momentId }: Props) {
  const reaction = await redis.hIncrBy(
    `moment_reaction`,
    momentId.toString(),
    -1
  );

  return reaction;
}
