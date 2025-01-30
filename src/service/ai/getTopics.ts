import Cache from "cache";
import { Topic } from "common";
import db from "db";

import ServerError from "error/ServerError";
import topicRecommendationModel from "ai/topicRecommendation";

import type { WithRequired } from "utility";

interface Props {
  text: string;
}

export default async function getTopics({ text }: Props) {
  const result = await topicRecommendationModel.generateContent(text);
  let topicNames: string[];
  try {
    topicNames = JSON.parse(result.response.text()).topics;
  } catch (e) {
    throw new ServerError("ai", "Unable to parse ai response");
  }

  topicNames = topicNames.filter(
    (topic) => topic.length <= 20 && /^[가-힣\da-zA-Z]*$/g.test(topic)
  );

  const topicRows = (
    await db.topic.getByNames({
      names: topicNames,
    })
  )[0];

  const knwon: WithRequired<Topic, "usage">[] = await Promise.all(
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

  knwon.sort((a, b) => b.usage - a.usage);

  const unknown = topicNames.filter(
    (topicName) =>
      !knwon.find(
        (topic) => topic.name.toLowerCase() === topicName.toLowerCase()
      )
  );

  return { knwon, unknown };
}
