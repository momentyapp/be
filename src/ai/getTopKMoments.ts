import { pinecone, momentIndex } from "ai";

export default async function getTopKMoments(
  embedding: number[],
  k: number = 3
) {
  const result = await pinecone.index("moment").query({
    topK: k,
    vector: embedding,
  });

  const filtered = result.matches.filter(
    (match) => match.score !== undefined && match.score > 0.3
  );

  return filtered.map((match) => ({
    id: parseInt(match.id),
    score: match.score,
  }));
}
