import Cache, { redisClient as redis } from "cache";

interface Props {
  momentId: number;
  reaction: number;
  timestamp: number;
}

export default async function takeReactionSnapshot({
  momentId,
  reaction,
  timestamp,
}: Props) {
  const latestSnapshot = await Cache.moment.getReactionSnapshotAtIndex({
    momentId,
    index: 0,
  });
  let result: number;

  // 스냅샷이 없거나 가장 최근 스냅샷보다 더 최신일 경우에만 스냅샷 생성
  if (latestSnapshot === null || latestSnapshot.timestamp < timestamp) {
    result = await redis.lPush(
      `moment:${momentId}:reaction_snapshot`,
      `${timestamp}:${reaction}`
    );
    await redis.lTrim(`moment:${momentId}:reaction_snapshot`, 0, 60);
  }
  // 가장 최근 스냅샷이 현재일 경우 스냅샷 업데이트
  else {
    await redis.lSet(
      `moment:${momentId}:reaction_snapshot`,
      0,
      `${timestamp}:${reaction}`
    );
    result = await redis.lLen(`moment:${momentId}:reaction_snapshot`);
  }

  return result;
}
