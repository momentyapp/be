import db from "db";

interface Props {
  momentId: number;
}

export default async function getReactions({ momentId }: Props) {
  const reactionRows = await db.moment.getReactions({ momentId });
  const reactions: Record<string, number> = {};
  for (const row of reactionRows[0]) reactions[row.emoji] = row.count;

  return reactions;
}
