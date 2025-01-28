import Cache from "cache";
import db from "db";
import Service from "service";

interface Props {
  userId?: number;
  start: number;
}

export default async function getTrendings({ userId, start }: Props) {
  const momentIds = await Cache.moment.getTrendings({ start });
  const momentRows = await db.moment.getByIds({
    momentIds,
    userId,
  });

  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
