import { z } from "zod";

import topicZod from "./topic";

const id = z.number().nonnegative();

const text = z.string().min(1).max(1000);

const stringTopicIds = z.string().refine((arg) => {
  try {
    const ids = JSON.parse(arg);
    if (!Array.isArray(ids)) return false;
    for (const id of ids) {
      if (!topicZod.id.safeParse(id).success) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}, "주제 아이디 목록이 올바르지 않아요.");

const topicIds = z.array(topicZod.id);

const expiresIn = z.coerce.number().int().min(1).max(72).optional();

const emoji = z.string().emoji();

const momentZod = {
  id,
  text,
  stringTopicIds,
  topicIds,
  expiresIn,
  emoji,
};

export default momentZod;
