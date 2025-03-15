import { topicIndex } from "ai";

export default async function addTopicEmbeddings(
  topics: { id: number; embedding: number[] }[]
) {
  return topicIndex.upsert(
    topics.map((topic) => ({
      id: topic.id.toString(),
      values: topic.embedding,
    }))
  );
}
