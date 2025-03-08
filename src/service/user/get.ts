import getSaltedHash from "util/getSaltedHash";

import db from "db";

import type { User } from "common";
import Service from "service";

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

  const users = Service.user.convertRows({ userRows: userRow[0] });

  return users[0];
}
