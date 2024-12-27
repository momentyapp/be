import { redisClient as redis } from "cache";

/**
 * @description 모든 모멘트의 반응 개수를 가져옵니다.
 * @returns 모든 모멘트의 반응 개수를 반환합니다. 반환할 정보가 없을 경우 null을 반환합니다.
 */
export default async function getReactionCounts() {
  if ((await redis.exists(`moment_reaction`)) === 0) return null;
  const result = await redis.hGetAll(`moment_reaction`);
  const parsedResult: Record<number, number> = {};
  for (const key in result) parsedResult[parseInt(key)] = parseInt(result[key]);
  return parsedResult;
}
