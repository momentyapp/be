import dotenv from "dotenv";
import { hf } from "ai";

export default async function getEmbedding(text: string) {
  dotenv.config();

  const result = await hf.featureExtraction({
    inputs: text,
    model: "snunlp/KR-SBERT-V40K-klueNLI-augSTS",
    endpointUrl: process.env.HF_HOST,
  });

  return result as number[];
}
