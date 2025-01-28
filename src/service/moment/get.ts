import db from "db";
import Service from "service";

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

  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
