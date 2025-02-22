import Cache from "cache";
import db from "db";

import getTopKTopics from "ai/getTopKTopics";

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

    const topKTopics = await getTopKTopics(text, 3, signal);

    const topicRows =
      topKTopics.length > 0
        ? (
            await db.topic.getByIds({
              topicIds: topKTopics.map(({ id }) => id),
            })
          )[0]
        : [];

    const trendingTopicIds = await Cache.topic.getTrendings();

    const result = await Promise.all(
      topicRows.map(async (topicRow, index) => {
        const { id, name } = topicRow;
        const usage = await Cache.topic.getUsage({ topicId: id });

        return {
          id,
          name,
          usage,
          score: topKTopics[index].score,
          trending: trendingTopicIds.includes(id),
        };
      })
    );

    resolve(result);
  });
}
