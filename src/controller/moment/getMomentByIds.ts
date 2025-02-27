import { z } from "zod";

import Service from "service";

import momentZod from "zod/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const GetMomentByIdsRequestBody = z.object({
  momentIds: momentZod.id.array(),
});

// 응답 body
type ResponseBody = ApiResponse<{
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
const getMomentById: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetMomentByIdsRequestBody>
> = async function (req, res, next) {
  const userId = req.userId;
  const { momentIds } = req.body;

  let moments: Moment[];
  try {
    moments = await Service.moment.getByIds({
      momentIds,
      userId,
    });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: "모멘트 목록을 불러왔어요.",
    code: "success",
    result: {
      moments,
    },
  });
};

export default getMomentById;
