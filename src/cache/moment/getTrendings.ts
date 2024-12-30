import { redisClient as redis } from "cache";

interface Props {
  start: number;
}

/**
 * @description 트렌딩 모멘트를 불러옵니다.
 * @param start 모멘트의 시작 인덱스
 */
export default async function getTrendings({ start }: Props) {
  const result = await redis.zRange("moment_score", start, start + 9);
  const parsedResult: number[] = [];
  for (const key in result) parsedResult.push(parseInt(result[key]));
  return parsedResult;
}
