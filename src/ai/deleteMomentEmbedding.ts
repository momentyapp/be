import { momentIndex } from "ai";

export default async function deleteMomentEmbedding(ids: number[]) {
  await momentIndex.deleteMany(ids.map((id) => id.toString()));
  return;
}
