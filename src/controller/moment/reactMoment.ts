import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";

import momentZod from "zod/moment";

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

  try {
    await Service.moment.react({
      userId,
      emoji,
      momentId,
    });
  } catch (error) {
    return next(error);
  }

  const reactions = await Service.moment.getReactions({
    momentId,
  });

  return res.status(200).json({
    message: "반응을 등록했어요.",
    code: "success",
    result: {
      reactions,
    },
  });
};

export default reactMoment;
