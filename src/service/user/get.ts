import getSaltedHash from "util/getSaltedHash";

import db from "db";

import type { User } from "common";

interface Props {
  plainPassword: string;
  username: string;
}

export default async function get({ plainPassword, username }: Props) {
  // salt를 가져온 뒤 해싱
  let userRow = await db.user.getByUsername({ username });
  if (userRow[0].length !== 1) return null;

  const { salt } = userRow[0][0];
  const hashedPassword = getSaltedHash(plainPassword, salt);

  // 비밀번호 확인
  userRow = await db.user.getByUsername({
    username,
    password: hashedPassword,
  });
  if (userRow[0].length !== 1) return null;

  const user: User = {
    id: userRow[0][0].id,
    username: userRow[0][0].username,
    createdAt: userRow[0][0].createdAt,
    photo: userRow[0][0].photo ?? undefined,
  };

  return user
}
