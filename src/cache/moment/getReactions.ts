import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
}

/**
 * @description 모멘트의 모든 반응을 가져옵니다.
 * @param momentId 반응을 가져올 모멘트의 아이디
 * @returns 반응들을 반환합니다. 모멘트가 없을 경우 null을 반환합니다.
 */
export default async function getReactions({ momentId }: Props) {
  if ((await redis.exists(`moment:${momentId}:reaction`)) === 0) return null;
  const result = await redis.hGetAll(`moment:${momentId}:reaction`);
  const parsedResult: Record<string, number> = {};
  for (const key in result) parsedResult[key] = parseInt(result[key]);
  return parsedResult;
}
