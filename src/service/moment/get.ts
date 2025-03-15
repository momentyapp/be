import Service from "service";
import getTopicEmbedding from "ai/getTopicEmbedding";

import type { Moment } from "common";

interface Props {
  topicIds: number[];
  before?: number;
  userId?: number;
}

export default async function get({ topicIds, before, userId }: Props) {
  const topicEmbeddings = (
    await Promise.all(
      topicIds.map(async (topicId) => await getTopicEmbedding(topicId))
    )
  ).filter((embedding) => embedding !== null);

  const moments: Moment[] = (
    await Promise.all([
      Service.moment.getByEmbeddings({
        embeddings: topicEmbeddings,
        before,
        userId,
      }),
      Service.moment.getByTopicIds({ topicIds, before, userId }),
    ])
  ).flat();

  return moments;
}
