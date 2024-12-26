import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import createTopic, {
  CreateTopicRequestBody,
} from "controller/topic/createTopic";

const topicRouter = express.Router();

// 컨트롤러
topicRouter.post(
  "/",
  trimBodyString,
  validateRequest({ body: CreateTopicRequestBody }),
  createTopic
);

export default topicRouter;
