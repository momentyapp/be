import { z } from "zod";

import upsertMomentReaction from "model/moment/upsertMomentReaction";

import isQueryError from "util/isQueryError";

import ServerError from "error/ServerError";

import momentSchema from "schema/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import ClientError from "error/ClientError";
import deleteMomentReaction from "model/moment/deleteMomentReaction";

// 요청 body
export const ReactMomentRequestBody = z.object({
  momentId: momentSchema.id,
  emoji: momentSchema.emoji.optional(),
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
  if (userId === undefined) {
    return next(
      new ServerError(
        "auth",
        "Failed to load userID.",
        "사용자 아이디를 불러오는 데 실패했어요."
      )
    );
  }

  // 모멘트 반응 추가
  if (req.body.emoji !== undefined) {
    try {
      await upsertMomentReaction({
        userId,
        momentId: req.body.momentId,
        emoji: req.body.emoji,
      });
    } catch (error) {
      if (!(error instanceof Error && isQueryError(error))) return next(error);

      // 모멘트가 존재하지 않을 때
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return next(new ClientError("존재하지 않는 모멘트예요."));
      }

      return next(error);
    }
  }
  // 모멘트 반응 제거
  else {
    const queryResult = await deleteMomentReaction({
      userId,
      momentId: req.body.momentId,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ClientError("이미 반응을 취소했어요."));
  }

  // 캐싱

  return res.status(200).json({
    message: "모멘트가 게시됐어요.",
    code: "success",
    result: {
      reactions: {},
    },
  });
};

export default reactMoment;
