import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  index: number;
}

export default async function getReactionSnapshotAtIndex({
  momentId,
  index,
}: Props) {
  const result = await redis.lIndex(
    `moment:${momentId}:reaction_snapshot`,
    index
  );
  if (result === null) return null;

  const [timestamp, reaction] = result.split(":").map((x) => parseInt(x));
  if (isNaN(timestamp) || isNaN(reaction)) return null;
  return { timestamp, reaction };
}
