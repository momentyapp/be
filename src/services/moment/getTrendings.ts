import cache from "cache";
import db from "db";
import services from "services";

interface Props {
  userId?: number;
  start: number;
}

export default async function getTrendings({ userId, start }: Props) {
  const momentIds = await cache.moment.getTrendings({ start });
  const momentRows = await db.moment.getByIds({
    momentIds,
    userId,
  });
  console.log(momentRows[0]);

  const moments = services.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
