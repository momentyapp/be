import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  score: number;
}

/**
 * @description 모멘트의 트렌드 스코어를 설정합니다.
 * @param momentId 반응을 설정할 모멘트의 아이디
 * @param trendScore 설정할 트렌드 스코어
 * @returns 성공 시 true를 반환하고 실패 시 false를 반환합니다.
 */
export default async function setTrendScore({ momentId, score }: Props) {
  const result = await redis.zAdd(`moment_score`, {
    score,
    value: momentId.toString(),
  });

  if (result === 0) return false;
  return true;
}
