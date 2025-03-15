import { momentIndex } from "ai";

export default async function addMomentEmbedding(
  moments: { id: number; embedding: number[] }[]
) {
  return momentIndex.upsert(
    moments.map((topic) => ({
      id: topic.id.toString(),
      values: topic.embedding,
    }))
  );
}
