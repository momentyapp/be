import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  score: number;
}

/**
 * @description 모멘트의 트렌드 스코어를 설정합니다.
 * @param momentId 반응을 설정할 모멘트의 아이디
 * @param trendScore 설정할 트렌드 스코어
 */
export default async function setTrendScore({ momentId, score }: Props) {
  await redis.zAdd(`moment_score`, {
    score,
    value: momentId.toString(),
  });
}
