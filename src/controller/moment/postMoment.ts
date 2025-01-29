import { z } from "zod";

import Service from "service";

import momentZod from "zod/moment";

import ServerError from "error/ServerError";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const PostMomentRequestBody = z.object({
  text: momentZod.text,
  topicIds: momentZod.topicIds,
  expiresIn: momentZod.expiresIn,
});

// 응답 body
type ResponseBody = ApiResponse<{
  momentId: number;
}>;

// 핸들러
const postMoment: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof PostMomentRequestBody>
> = async function (req, res, next) {
  const { files, userId } = req;
  const { text, topicIds, expiresIn } = req.body;

  let momentId: number;
  try {
    momentId = await Service.moment.post({
      photos: Array.isArray(files) ? files : undefined,
      userId,
      text,
      topicIds,
      expiresIn,
    });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "모멘트가 게시됐어요.",
    code: "success",
    result: { momentId },
  });
};

export default postMoment;
