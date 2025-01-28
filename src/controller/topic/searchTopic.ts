import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import type { Topic } from "common";

// 요청 body
export const SearchTopicQuery = z.object({
  query: z.string().min(1),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  topics: Topic[];
}>;

// 핸들러
const searchTopic: RequestHandler<{}, ResponseBody, {}> = async function (
  req,
  res,
  next
) {
  if (req.parsedQuery === undefined)
    return new ServerError("query", "Unable to parse query");

  let topics: Topic[];
  try {
    topics = await Service.topic.search({ query: req.parsedQuery.query });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "주제를 검색했어요.",
    code: "success",
    result: {
      count: topics.length,
      topics,
    },
  });
};

export default searchTopic;
