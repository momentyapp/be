import { pc } from "ai";

import getEmbedding from "./getEmbedding";

export default async function getTopKTopics(query: string) {
  const embedding = await getEmbedding(query);

  const result = await pc.query({
    topK: 3,
    vector: embedding,
  });

  const filtered = result.matches.filter(
    (match) => match.score !== undefined && match.score > 0.5
  );

  return filtered.map((match) => ({
    id: parseInt(match.id),
    score: match.score,
  }));
}
