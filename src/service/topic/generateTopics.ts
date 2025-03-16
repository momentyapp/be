import Cache from "cache";
import db from "db";

import extractKeywords from "ai/extractKeywords";

import type { GeneratedTopic } from "common";

interface Props {
  text: string;
  signal?: AbortSignal;
}

export default function generateTopics({
  text,
  signal,
}: Props): Promise<GeneratedTopic[]> {
  return new Promise(async (resolve, reject) => {
    signal?.addEventListener("abort", () => {
      reject();
    });

    // 키워드 추출
    const keywordsResponse = await extractKeywords(text);
    if (keywordsResponse.status !== 200) {
      resolve([]);
      return;
    }
    const keywords = keywordsResponse.data.filter((keyword) => keyword.r > 1);

    // db에서 알려진 주제 가져오기
    const topicRows =
      keywords.length > 0
        ? (
            await db.topic.getByNames({
              names: keywords.map(({ word }) => word),
            })
          )[0]
        : [];

    // 캐시에서 트렌딩 주제 가져오기
    const trendingTopicIds = await Cache.topic.getTrendings();

    // 주제가 알려졌는지 확인
    const result: GeneratedTopic[] = await Promise.all(
      keywords.map(async (keyword) => {
        const topicRow = topicRows.find((row) => row.name === keyword.word);

        // 주제가 알려졌을 때
        if (topicRow !== undefined) {
          const { id, name } = topicRow;
          const usage = await Cache.topic.getUsage({ topicId: id });

          return {
            id,
            name,
            usage,
            score: keyword.r,
            trending: trendingTopicIds.includes(id),
            known: true,
          };
        }

        // 주제가 알려지지 않았을 때
        return {
          name: keyword.word,
          score: keyword.r,
          known: false,
        };
      })
    );

    resolve(result);
  });
}
