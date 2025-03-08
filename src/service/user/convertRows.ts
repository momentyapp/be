import { QueryResultRow } from "utility";

import type { User } from "common";

interface UserRow {
  id: number;
  username: string;
  createdAt: string;
  password: string;
  salt: string;
  photo: string | null;
}

interface Props {
  userRows: QueryResultRow<UserRow>[];
}

export default function convertRows({ userRows }: Props) {
  const users: User[] = [];
  for (const user of userRows) {
    const result: User = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      photo: user.photo ?? undefined,
    };

    users.push(result);
  }

  return users;
}
