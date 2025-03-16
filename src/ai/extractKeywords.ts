import { axiosInstance } from "ai";

type Response = {
  word: string;
  r: number;
}[];

export default async function extractKeywords(text: string) {
  const result = await axiosInstance.get<Response>(`/${text}`);

  return result;
}
