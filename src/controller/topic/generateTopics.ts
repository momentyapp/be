import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import type { Topic } from "common";
import type { WithRequired } from "utility";

// 요청 body
export const GenerateTopicsQuery = z.object({
  text: z.string().min(10).max(1000),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  topics: {
    registered: boolean;
    id?: number;
    name: string;
    trending?: boolean;
    usage?: number;
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

  let result: {
    registered: WithRequired<Topic, "usage">[];
    unregistered: string[];
  };

  try {
    result = await Service.topic.generate({ text });
  } catch (error) {
    return next(error);
  }

  const topics = [
    ...result.registered.map((topic) => ({
      registered: true,
      ...topic,
    })),
    ...result.unregistered.map((name) => ({
      registered: false,
      name,
    })),
  ];

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
