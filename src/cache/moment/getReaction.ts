import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
}

export default async function getReaction({ momentId }: Props) {
  const reaction =
    (await redis.hGet(`moment_reaction`, momentId.toString())) ?? "0";
  return parseInt(reaction);
}
