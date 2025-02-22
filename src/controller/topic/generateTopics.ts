import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const GenerateTopicsQuery = z.object({
  text: z.string().min(10).max(1000),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  topics: {
    id: number;
    name: string;
    trending: boolean;
    score?: number;
    usage: number;
  }[];
}>;

// 핸들러
const generateTopics: RequestHandler<{}, ResponseBody, {}> = async function (
  req,
  res,
  next
) {
  if (req.parsedQuery === undefined)
    return new ServerError("query", "Unable to parse query");

  const { text } = req.parsedQuery as z.infer<typeof GenerateTopicsQuery>;

  const topics = await Service.topic.generate({ text });

  return res.status(200).json({
    message: "추천 주제를 불러왔어요.",
    code: "success",
    result: {
      count: topics.length,
      topics,
    },
  });
};

export default generateTopics;
