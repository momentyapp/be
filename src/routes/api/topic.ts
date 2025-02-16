import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import createTopic, {
  CreateTopicRequestBody,
} from "controller/topic/createTopic";
import getTrendingTopics, {
  GetTrendingTopicsRequestQuery,
} from "controller/topic/getTrendingTopics";
import searchTopic, { SearchTopicQuery } from "controller/topic/searchTopic";
import generateTopics, {
  GenerateTopicsQuery,
} from "controller/topic/generateTopics";

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
topicRouter.get(
  "/search",
  validateRequest({ query: SearchTopicQuery }),
  searchTopic
);
topicRouter.get(
  "/generate",
  validateRequest({ query: GenerateTopicsQuery }),
  generateTopics
);

export default topicRouter;
