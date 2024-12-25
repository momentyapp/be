import { z } from "zod";

const username = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[가-힣a-zA-Z0-9_]+$/, {
    message: "사용자 이름에는 한글, 영어, 숫자, 밑줄(_)만 쓸 수 있어요.",
  });

const password = z
  .string()
  .min(8)
  .max(20)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/, {
    message: "비밀번호는 영어, 숫자를 조합하여야 해요.",
  });

const userZod = {
  username,
  password,
};

export default userZod;
