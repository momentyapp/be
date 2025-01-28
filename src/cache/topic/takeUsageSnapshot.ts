import Cache, { redisClient as redis } from "cache";

interface Props {
  topicId: number;
  usage: number;
  timestamp: number;
}

export default async function takeUsageSnapshot({
  topicId,
  usage,
  timestamp,
}: Props) {
  const latestSnapshot = await Cache.topic.getUsageSnapshotAtIndex({
    topicId,
    index: 0,
  });
  let result: number;

  // 스냅샷이 없거나 가장 최근 스냅샷보다 더 최신일 경우에만 스냅샷 생성
  if (latestSnapshot === null || latestSnapshot.timestamp < timestamp) {
    result = await redis.lPush(
      `topic:${topicId}:usage_snapshot`,
      `${timestamp}:${usage}`
    );
    await Cache.topic.trimUsageSnapshot({ topicId, count: 60 });
  }
  // 가장 최근 스냅샷이 현재일 경우 스냅샷 업데이트
  else {
    await redis.lSet(
      `topic:${topicId}:usage_snapshots`,
      0,
      `${timestamp}:${usage}`
    );
    result = await redis.lLen(`topic:${topicId}:usage_snapshot`);
  }

  return result;
}
