import Cache from "cache";
import { Topic } from "common";
import db from "db";

interface Props {
  query: string;
}

export default async function search({ query }: Props) {
  const topicRows = (
    await db.topic.search({
      query,
    })
  )[0];

  const topics: Topic[] = await Promise.all(
    topicRows.map(async (topicRow) => {
      const { id, name } = topicRow;
      const [usage, rank] = await Promise.all([
        Cache.topic.getUsage({ topicId: id }),
        Cache.topic.getTrendRank({ topicId: id }),
      ]);

      return {
        id,
        name,
        usage,
        trending: rank !== null ? rank < 10 : false,
      };
    })
  );

  return topics;
}
