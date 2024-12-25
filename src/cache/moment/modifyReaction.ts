import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  emoji: string;
  amount: number;
}

/**
 * @description 모멘트의 반응 개수를 수정합니다.
 * @param momentId 반응 개수를 수정할 모멘트의 아이디
 * @param emoji 수정할 반응의 이모지
 * @param amount 수정 양
 * @returns 성공 시 true를 반환하고 실패 시 false를 반환합니다.
 */
export default async function modifyReaction({
  momentId,
  emoji,
  amount,
}: Props) {
  if ((await redis.exists(`moment:${momentId}:reaction`)) === 0) return false;
  const result = await redis.hIncrBy(
    `moment:${momentId}:reaction`,
    emoji,
    amount
  );
  if (result === 0) return false;
  return true;
}
