import Cache from "cache";

interface Props {
  topicId: number;
  snapshotCount: number;
  usage: number;
  timestamp: number;
}

export default async function updateTrendScore({
  topicId,
  snapshotCount,
  usage,
  timestamp,
}: Props) {
  const c1 = usage;

  // 한 시간 전 스냅샷 찾기
  let index: number;
  let c0 = c1;

  for (index = snapshotCount - 1; index >= 0; index--) {
    const snapshot = await Cache.topic.getUsageSnapshotAtIndex({
      topicId,
      index,
    });

    if (snapshot === null) continue;
    if (snapshot.timestamp >= timestamp - 60) break;

    c0 = snapshot.usage;
  }

  // 사용되지 않는 스냅샷 제거
  await Cache.topic.trimUsageSnapshot({ topicId, count: index });

  // 트렌드 점수 계산
  const score = c0 + 5 * (c1 - c0);
  await Cache.topic.setTrendScore({ topicId, score });
}
