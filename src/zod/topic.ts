import { z } from "zod";

const id = z.number().nonnegative();

const name = z
  .string()
  .regex(/^[가-힣\da-zA-Z]*$/g, "주제는 문자와 숫자로만 구성돼야 해요.")
  .min(1)
  .max(20);

const topicZod = {
  id,
  name,
};

export default topicZod;
