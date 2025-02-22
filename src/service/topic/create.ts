import db from "db";

import isQueryError from "util/isQueryError";

import ServerError from "error/ServerError";
import ClientError from "error/ClientError";

import getEmbedding from "ai/getEmbedding";
import addTopicEmbeddings from "ai/addTopicEmbedding";

interface Props {
  name: string;
}

export default async function create({ name }: Props) {
  // DB에 등록
  let queryResult;
  try {
    queryResult = await db.topic.create({ name });

    // 주제 생성 실패 시
    if (queryResult[0].affectedRows === 0) {
      throw new ServerError(
        "query",
        "Unable to create topic.",
        "주제를 생성하지 못 했어요."
      );
    }
  } catch (error) {
    if (!(error instanceof Error && isQueryError(error))) throw error;

    // 주제가 중복될 때
    if (error.code === "ER_DUP_ENTRY" && error.message.includes("name")) {
      throw new ClientError("이미 존재하는 주제예요.");
    }

    throw error;
  }
  const topicId = queryResult[0].insertId;

  // 임베딩 생성 후 등록
  const embedding = await getEmbedding(name);
  await addTopicEmbeddings([
    {
      id: topicId,
      embedding,
    },
  ]);

  return topicId;
}
