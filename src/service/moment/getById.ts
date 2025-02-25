import db from "db";
import Service from "service";

interface Props {
  momentId: number;
  userId?: number;
}

export default async function getById({ momentId, userId }: Props) {
  const momentRows = await db.moment.getByIds({
    momentIds: [momentId],
    userId,
  });

  const moments = Service.moment.convertRows({ momentRows: momentRows[0] });

  return moments;
}
