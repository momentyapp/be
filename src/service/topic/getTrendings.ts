import Cache from "cache";
import { Topic } from "common";
import db from "db";

import type { WithRequired } from "utility";

export default async function getTrendings() {
  const topicIds = await Cache.topic.getTrendings();
  const topicRows = (
    await db.topic.getByIds({
      topicIds,
    })
  )[0];

  const topics: WithRequired<Topic, "usage">[] = await Promise.all(
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

  topics.sort((a, b) => b.usage - a.usage);

  return topics;
}
