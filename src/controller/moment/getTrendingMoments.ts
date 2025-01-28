import { z } from "zod";

import Service from "service";

import ServerError from "error/ServerError";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";
import type { Moment } from "common";

// 요청 body
export const GetTrendingMomentsRequestQuery = z.object({
  start: z.number().int().nonnegative(),
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  moments: Moment[];
}>;

// 핸들러
const getTrendingMoments: RequestHandler<{}, ResponseBody, {}> =
  async function (req, res, next) {
    if (req.parsedQuery === undefined)
      return new ServerError("query", "Unable to parse query");

    const userId = req.userId;
    const { start } = req.parsedQuery as z.infer<
      typeof GetTrendingMomentsRequestQuery
    >;

    let moments: Moment[];
    try {
      moments = await Service.moment.getTrendings({
        start,
        userId,
      });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({
      message: "실시간 트렌드 모멘트를 불러왔어요.",
      code: "success",
      result: {
        count: moments.length,
        moments,
      },
    });
  };

export default getTrendingMoments;
