import { z } from "zod";

import ServerError from "error/ServerError";
import momentZod from "zod/moment";

import services from "services";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const ReactMomentRequestBody = z.object({
  momentId: momentZod.id,
  emoji: z.union([momentZod.emoji, z.null()]),
});

// 응답 body
type ResponseBody = ApiResponse<{
  reactions: {
    [reaction: string]: number;
  };
}>;

// 핸들러
const reactMoment: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof ReactMomentRequestBody>
> = async function (req, res, next) {
  const userId = req.userId;
  const { emoji, momentId } = req.body;

  if (userId === undefined) {
    return next(
      new ServerError(
        "auth",
        "Failed to load userID.",
        "사용자 아이디를 불러오는 데 실패했어요."
      )
    );
  }

  await services.moment.react({
    userId,
    emoji,
    momentId,
  });

  const reactions = await services.moment.getReactions({
    momentId,
  });

  return res.status(200).json({
    message: "모멘트가 게시됐어요.",
    code: "success",
    result: {
      reactions,
    },
  });
};

export default reactMoment;
