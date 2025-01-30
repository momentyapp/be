import { z } from "zod";

import Service from "service";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import type { Topic } from "common";
import type { WithRequired } from "utility";

// 요청 body
export const GetTopicRecommendationBody = z.object({
  text: z.string().min(10).max(1000),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  known: Topic[];
  unknown: string[];
}>;

// 핸들러
const getTopicRecommendation: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetTopicRecommendationBody>
> = async function (req, res, next) {
  const { text } = req.body;

  let result: {
    knwon: WithRequired<Topic, "usage">[];
    unknown: string[];
  };

  try {
    result = await Service.ai.getTopics({ text });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "추천 주제를 불러왔어요.",
    code: "success",
    result: {
      count: result.knwon.length + result.unknown.length,
      known: result.knwon,
      unknown: result.unknown,
    },
  });
};

export default getTopicRecommendation;
