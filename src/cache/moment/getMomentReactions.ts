import redis from "cache";

interface GetMomentReactionsProps {
  momentId: number;
}

export default async function getMomentReactions({
  momentId,
}: GetMomentReactionsProps) {
  if ((await redis.exists(`moment:${momentId}:reaction`)) === 0) return null;

  const result = await redis.hGetAll(`moment:${momentId}:reaction`);
  const parsedResult: Record<string, number> = {};
  for (const key in result) {
    parsedResult[key] = parseInt(result[key]);
  }
  return parsedResult;
}
