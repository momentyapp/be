import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { Connection } from "mysql2/promise";

interface CreateMomentProps {
  userId?: number;
  expiresIn?: number;
  text: string;
  photos?: string[];
  topicsIds?: number[];
}

export default async function createMoment(
  { userId, expiresIn, text, photos, topicsIds }: CreateMomentProps,
  conn: Connection = db
) {
  const expiresInMs =
    expiresIn !== undefined ? expiresIn * 60 * 60 * 1000 : null;
  const queryResult = await conn.query<ResultSetHeader>(
    "INSERT INTO moment SET ?",
    {
      userId,
      expiresAt: expiresInMs ? new Date(Date.now() + expiresInMs) : null,
      text,
    }
  );

  if (photos) {
    for (const photo of photos) {
      await conn.query<ResultSetHeader>("INSERT INTO moment_photo SET ?", {
        momentId: queryResult[0].insertId,
        path: photo,
      });
    }
  }

  if (topicsIds) {
    for (const topicId of topicsIds) {
      await conn.query<ResultSetHeader>("INSERT INTO moment_topic SET ?", {
        momentId: queryResult[0].insertId,
        topicId,
      });
    }
  }

  return queryResult;
}
