import redis from "cache";

interface SetMomentReactionsProps {
  momentId: number;
  reactions: {
    [emoji: string]: number;
  };
}

export default async function setMomentReactions({
  momentId,
  reactions,
}: SetMomentReactionsProps) {
  const total = Object.values(reactions).reduce((acc, cur) => acc + cur, 0);

  await Promise.all([
    ...Object.keys(reactions).map((emoji) => {
      redis.hSet(`moment:${momentId}:reaction`, emoji, reactions[emoji]);
    }),
    redis.hSet(`moment:${momentId}:reaction`, "total", total),
  ]);

  return true;
}
