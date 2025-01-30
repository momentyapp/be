import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import getTopicRecommendation, {
  GetTopicRecommendationBody,
} from "controller/ai/getTopicRecommendation";

const aiRouter = express.Router();

// 컨트롤러
aiRouter.post(
  "/topic",
  trimBodyString,
  validateRequest({ body: GetTopicRecommendationBody }),
  getTopicRecommendation
);

export default aiRouter;
