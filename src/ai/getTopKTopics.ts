import { topicIndex } from "ai";

import getEmbedding from "./getEmbedding";

export default async function getTopKTopics(
  query: string,
  k: number = 3,
  signal?: AbortSignal
) {
  const embedding = await getEmbedding(query, signal);

  const result = await topicIndex.query({
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
