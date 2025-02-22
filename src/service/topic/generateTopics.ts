import Cache from "cache";
import db from "db";

import getTopKTopics from "ai/getTopKTopics";

interface Props {
  text: string;
}

export default async function generateTopics({ text }: Props) {
  const topKTopics = await getTopKTopics(text);

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

  return result;
}
