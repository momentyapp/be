import { pinecone, momentIndex } from "ai";

export default async function addMomentEmbedding(
  moments: { id: number; embedding: number[] }[]
) {
  return await pinecone.index("moment").upsert(
    moments.map((moment) => ({
      id: moment.id.toString(),
      values: moment.embedding,
    }))
  );
}
