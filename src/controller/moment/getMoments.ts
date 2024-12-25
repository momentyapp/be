import { z } from "zod";

import db from "db";

import momentZod from "zod/moment";

import type { ApiResponse } from "api";
import type { RequestHandler } from "express";

// 요청 body
export const GetMomentsRequestBody = z.object({
  topicIds: momentZod.topicIds,
  before: momentZod.id,
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
  myEmoji?: string;
}

// 핸들러
const getMoments: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof GetMomentsRequestBody>
> = async function (req, res, next) {
  const userId = req.userId;

  const moments = await db.moment.getByTopics({
    topicIds: req.body.topicIds,
    before: req.body.before,
    userId,
  });

  const results: Moment[] = [];
  for (const moment of moments[0]) {
    // 작성자 가져오기
    let author: Moment["author"] = undefined;
    if (
      moment.userId !== null &&
      moment.username !== null &&
      moment.userCreatedAt !== null
    ) {
      author = {
        id: moment.userId,
        username: moment.username,
        createdAt: moment.userCreatedAt,
        photo: moment.userPhoto ?? undefined,
      };
    }

    // 본문 가져오기
    const body: Moment["body"] = {
      text: moment.text,
    };
    if (moment.photos !== null) {
      body.photos = moment.photos.split(",");
    }

    // 주제 가져오기
    const topics: Moment["topics"] = [];
    if (moment.topicIds !== null && moment.topicNames !== null) {
      const topicIds = moment.topicIds.split(",");
      const topicNames = moment.topicNames.split(",");
      for (let i = 0; i < topicIds.length; i++) {
        topics.push({
          id: parseInt(topicIds[i]),
          name: topicNames[i],
        });
      }
    }

    // 반응 가져오기
    const reactions: Moment["reactions"] = {};
    if (moment.emojis !== null) {
      const emojis = moment.emojis.split(",");
      for (const emoji of emojis) {
        const [reaction, count] = emoji.split(":");
        reactions[reaction] = parseInt(count);
      }
    }

    // 모멘트 객체 생성
    const result: Moment = {
      id: moment.id,
      author,
      createdAt: moment.createdAt,
      body,
      topics,
      reactions,
      expiresAt: moment.expiresAt,
      myEmoji: moment.myEmoji ?? undefined,
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
