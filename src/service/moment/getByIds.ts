import db from "db";
import Service from "service";

interface Props {
  momentIds: number[];
  userId?: number;
}

export default async function getByIds({ momentIds, userId }: Props) {
  const momentRows = await db.moment.getByIds({
    momentIds,
    userId,
  });

  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
