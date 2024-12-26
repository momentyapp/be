import { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  reactions: {
    [emoji: string]: number;
  };
}

/**
 * @description 모멘트의 반응을 설정합니다. 모멘트의 기존 반응을 전부 덮어씁니다.
 * @param momentId 반응을 설정할 모멘트의 아이디
 * @param reactions 설정할 반응들
 * @returns 성공 시 true를 반환하고 실패 시 false를 반환합니다.
 */
export default async function setReactions({ momentId, reactions }: Props) {
  const total = Object.values(reactions).reduce((acc, cur) => acc + cur, 0);
  const result = await Promise.all([
    redis.del(`moment:${momentId}:reaction`),
    ...Object.keys(reactions).map((emoji) =>
      redis.hSet(`moment:${momentId}:reaction`, emoji, reactions[emoji])
    ),
    redis.hSet(`moment_reaction`, momentId.toString(), total),
  ]);

  if (result.includes(0)) return false;
  return true;
}
