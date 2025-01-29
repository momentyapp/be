import db from "db";
import Service from "service";

interface Props {
  topicIds: number[];
  before?: number;
  userId?: number;
}

export default async function get({ topicIds, before, userId }: Props) {
  let momentRows;
  if (topicIds.length === 0)
    momentRows = await db.moment.get({ before, userId });
  else
    momentRows = await db.moment.getByTopics({
      topicIds,
      before,
      userId,
    });

  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
