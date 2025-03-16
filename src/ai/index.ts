import dotenv from "dotenv";
import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

dotenv.config();

// Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY!,
});

const topicIndex = pinecone
  .index("topic", process.env.PINECONE_HOST!)
  .namespace("");
const momentIndex = pinecone.index("moment");

// Huggingface
const hf = new HfInference(process.env.HF_KEY!);

// axios
const axiosInstance = axios.create({
  baseURL: `http://localhost:6062`,
});

export { pinecone, topicIndex, momentIndex, hf, axiosInstance };
