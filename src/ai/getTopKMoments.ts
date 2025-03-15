import { momentIndex } from "ai";

import getEmbedding from "./getEmbedding";

export default async function getTopKMoments(
  query: string,
  k: number = 3,
  signal?: AbortSignal
) {
  const embedding = await getEmbedding(query, signal);

  const result = await momentIndex.query({
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
