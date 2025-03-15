import { topicIndex } from "ai";

export default async function getTopicEmbedding(topicId: number) {
  const results = await topicIndex.query({
    id: topicId.toString(),
    topK: 1,
    includeValues: true,
  });

  if (results.matches.length === 0) return null;
  const result = results.matches[0];
  if (result.score === undefined || result.score < 0.5) return null;
  if (result.values === undefined) return null;

  return result.values;
}
