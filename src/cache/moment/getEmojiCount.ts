import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  emoji: string;
}

/**
 * @description 모멘트의 특정 이모지의 반응 개수를 가져옵니다.
 * @param momentId 반응 개수를 가져올 모멘트의 아이디
 * @param emoji 가져올 반응의 이모지
 * @returns 반응 개수를 반환합니다. 모멘트가 없을 경우 null을 반환합니다.
 */
export default async function getEmojiCount({ momentId, emoji }: Props) {
  if ((await redis.exists(`moment:${momentId}:reaction`)) === 0) return null;
  const result = await redis.hGet(`moment:${momentId}:reaction`, emoji);
  if (result === undefined) return 0;
  else return parseInt(result);
}
