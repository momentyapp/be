import Cache from "cache";
import Service from "service";

interface Props {
  topicId: number;
}

export default async function increaseUsage({ topicId }: Props) {
  // 사용 횟수 증가
  const usage = await Cache.topic.increaseUsage({ topicId });

  (async () => {
    // 스냅샷 생성
    const timestamp = Math.floor(Date.now() / 1000 / 60);
    const snapshotCount = await Cache.topic.takeUsageSnapshot({
      topicId,
      usage,
      timestamp,
    });

    // 트렌드 점수 업데이트
    await Service.topic.updateTrendScore({
      topicId,
      snapshotCount,
      usage,
      timestamp,
    });
  })();

  return usage;
}
