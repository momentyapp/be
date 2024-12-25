import db from "db";

import type { Moment } from "controller/moment/getMoments";

interface Props {
  topicIds: number[];
  before?: number;
  userId?: number;
}

export default async function get({ topicIds, before, userId }: Props) {
  const momentRows = await db.moment.getByTopics({
    topicIds,
    before,
    userId,
  });

  const moments: Moment[] = [];
  for (const moment of momentRows[0]) {
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

    moments.push(result);
  }

  return moments;
}
