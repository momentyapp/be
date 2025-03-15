import getTopKMoments from "ai/getTopKMoments";
import db from "db";
import Service from "service";

interface Props {
  embeddings: number[][];
  before?: number;
  userId?: number;
}

export default async function getByEmbeddings({
  embeddings,
  before,
  userId,
}: Props) {
  const results = await Promise.all(
    embeddings.map((embedding) => getTopKMoments(embedding))
  );
  const momentIds = results
    .flatMap((result) => result.map((r) => r.id))
    .filter((id) => before === undefined || id < before);

  if (momentIds.length === 0) return [];

  const momentRows = await db.moment.getByIds({ momentIds, userId });
  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
