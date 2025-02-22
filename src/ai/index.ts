import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

dotenv.config();

// Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY!,
});

const pc = pinecone.index("topic", process.env.PINECONE_HOST!).namespace("");

// Huggingface
const hf = new HfInference(process.env.HF_KEY!);

export { pc, hf };
