import { pc } from "ai";

export default async function addTopicEmbeddings(
  topics: { id: number; embedding: number[] }[]
) {
  return pc.upsert(
    topics.map((topic) => ({
      id: topic.id.toString(),
      values: topic.embedding,
    }))
  );
}
