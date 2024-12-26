import { redisClient as redis } from "cache";

/**
 * @description 모든 모멘트의 노출 시간을 가져옵니다.
 * @returns 모든 모멘트의 노출 시간을 반환합니다. 반환할 정보가 없을 경우 null을 반환합니다.
 */
export default async function getViews() {
  if ((await redis.exists(`moment_views`) === 0)) return null;
  const result = await redis.hGetAll(`moment_views`);
  const parsedResult: Record<string, number> = {};
  for (const key in result) parsedResult[key] = parseInt(result[key]);
  return parsedResult;
}
