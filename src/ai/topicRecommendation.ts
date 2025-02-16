import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEM_KEY!);
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    topics: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: ["topics"],
};

const topicRecommendationModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
  systemInstruction:
    "Please recommend up to 3 relevant keywords for the given post. Keywords should consists of single word and not contain special characters. Keywords should be written in Korean if possible.",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export default topicRecommendationModel;
