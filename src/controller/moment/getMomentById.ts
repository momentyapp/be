import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";
import momentZod from "zod/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import NotFoundError from "error/NotFoundError";

// 요청 body
export const GetMomentByIdRequestQuery = z.object({
  momentId: momentZod.id,
});

// 응답 body
type ResponseBody = ApiResponse<{
  moment: Moment;
}>;

export interface Moment {
  id: number;
  author?: {
    id: number;
    username: string;
    createdAt: string;
    photo?: string;
  };
  createdAt: string;
  body: {
    text: string;
    photos?: string[];
  };
  topics: {
    id: number;
    name: string;
    trending?: boolean;
    count?: number;
  }[];
  reactions: {
    [reaction: string]: number;
  };
  expiresAt?: string;
  myEmoji?: string;
}

// 핸들러
const getMomentById: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetMomentByIdRequestQuery>
> = async function (req, res, next) {
  if (req.parsedQuery === undefined)
    return new ServerError("query", "Unable to parse query");

  const userId = req.userId;
  const { momentId } = req.parsedQuery as z.infer<
    typeof GetMomentByIdRequestQuery
  >;

  let moments: Moment[];
  try {
    moments = await Service.moment.getById({
      momentId,
      userId,
    });
  } catch (error) {
    return next(error);
  }

  if (moments.length === 0) {
    return new NotFoundError("모멘트");
  }

  return res.status(200).json({
    message: "모멘트를 불러왔어요.",
    code: "success",
    result: {
      moment: moments[0],
    },
  });
};

export default getMomentById;
