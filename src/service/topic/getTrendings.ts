import Cache from "cache";
import { Topic } from "common";
import db from "db";

export default async function getTrendings() {
  const topicIds = await Cache.topic.getTrendings();
  const topicRows = (
    await db.topic.getByIds({
      topicIds,
    })
  )[0];

  const topics: Topic[] = await Promise.all(
    topicRows.map(async (topicRow) => {
      const { id, name } = topicRow;
      const usage = await Cache.topic.getUsage({ topicId: id });

      return {
        id,
        name,
        usage,
        trending: true,
      };
    })
  );

  return topics;
}
