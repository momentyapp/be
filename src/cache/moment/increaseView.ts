import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
}

/**
 * @description 모멘트의 노출 시간을 증가시킵니다.
 * @param momentId 노출 시간을 증가시킬 모멘트의 아이디
 * @returns 성공 시 true를 반환하고 실패 시 false를 반환합니다.
 */
export default async function increaseView({ momentId }: Props) {
  const result = await redis.hIncrBy(`moment_view`, momentId.toString(), 1);
  if (result === 0) return false;
  return true;
}
