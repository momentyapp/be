import { z } from "zod";

import Service from "service";

import momentZod from "zod/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const GetMomentsRequestBody = z.object({
  topicIds: momentZod.topicIds,
  before: momentZod.id.optional(),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  moments: Moment[];
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
const getMoments: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetMomentsRequestBody>
> = async function (req, res, next) {
  const userId = req.userId;
  const { topicIds, before } = req.body;

  let moments: Moment[];
  try {
    moments = await Service.moment.get({ topicIds, before, userId });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "모멘트를 불러왔어요.",
    code: "success",
    result: {
      count: moments.length,
      moments,
    },
  });
};

export default getMoments;
