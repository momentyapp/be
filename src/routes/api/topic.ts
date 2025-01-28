import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import createTopic, {
  CreateTopicRequestBody,
} from "controller/topic/createTopic";
import getTrendingTopics, {
  GetTrendingTopicsRequestQuery,
} from "controller/topic/getTrendingTopics";

const topicRouter = express.Router();

// 컨트롤러
topicRouter.post(
  "/",
  trimBodyString,
  validateRequest({ body: CreateTopicRequestBody }),
  createTopic
);
topicRouter.get(
  "/trend",
  validateRequest({ query: GetTrendingTopicsRequestQuery }),
  getTrendingTopics
);

export default topicRouter;
