import { z } from "zod";

import Service from "service";

import topicZod from "zod/topic";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const CreateTopicRequestBody = z.object({
  name: topicZod.name,
});

// 응답 body
type ResponseBody = ApiResponse<{
  topicId: number;
}>;

// 핸들러
const createTopic: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof CreateTopicRequestBody>
> = async function (req, res, next) {
  const { name } = req.body;

  let topicId: number;
  try {
    topicId = await Service.topic.create({ name });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "주제가 생성됐어요.",
    code: "success",
    result: { topicId },
  });
};

export default createTopic;
