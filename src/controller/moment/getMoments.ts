import { z } from "zod";

import selectMomentsByTopicId from "model/moment/selectMomentsByTopicId";

import momentSchema from "schema/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const GetMomentsRequestBody = z.object({
  topicIds: momentSchema.topicIds,
  before: momentSchema.id,
});

// 응답 body
type ResponseBody = ApiResponse<{
  count: number;
  moments: Moment[];
}>;

interface Moment {
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
}

// 핸들러
const getMoments: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetMomentsRequestBody>
> = async function (req, res, next) {
  const moments = await selectMomentsByTopicId({
    topicIds: req.body.topicIds,
    before: req.body.before,
  });

  const results: Moment[] = [];
  for (const moment of moments[0]) {
    const result: Moment = {
      id: moment.id,
      author:
        moment.userId === null ||
        moment.username === null ||
        moment.userCreatedAt === null
          ? undefined
          : {
              id: moment.userId,
              username: moment.username,
              createdAt: moment.userCreatedAt,
              photo: moment.userPhoto ?? undefined,
            },
      createdAt: moment.createdAt,
      body: {
        text: moment.text,
        photos: moment.photos ? moment.photos.split(",") : undefined,
      },
      topics: moment.topicIds.split(",").map((id, index) => ({
        id: parseInt(id),
        name: moment.topicNames.split(",")[index],
      })),
      reactions: {},
      expiresAt: moment.expiresAt,
    };

    results.push(result);
  }

  return res.status(200).json({
    message: "모멘트를 불러왔어요.",
    code: "success",
    result: {
      count: results.length,
      moments: results,
    },
  });
};

export default getMoments;
