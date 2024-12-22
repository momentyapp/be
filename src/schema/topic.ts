import { z } from "zod";

const id = z.number().nonnegative();

const name = z.string().min(1).max(20);

const topicSchema = {
  id,
  name,
};

export default topicSchema;
