import db from "db";
import services from "services";

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

  const moments = services.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
