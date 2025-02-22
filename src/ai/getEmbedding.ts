import { hf } from "ai";

export default async function getEmbedding(text: string) {
  const result = await hf.featureExtraction({
    inputs: text,
    model: "snunlp/KR-SBERT-V40K-klueNLI-augSTS",
  });

  return result as number[];
}
