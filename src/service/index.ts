import convertRows from "./moment/convertRows";
import get from "./moment/get";
import getReactions from "./moment/getReactions";
import getTrendingMoments from "./moment/getTrendings";
import post from "./moment/post";
import react from "./moment/react";
import updateMomentTrendScore from "./moment/updateTrendScore";

import createTopic from "./topic/create";
import increaseUsage from "./topic/increaseUsage";
import updateTopicTrendScore from "./topic/updateTrendScore";
import getTrendingTopics from "./topic/getTrendings";
import search from "./topic/search";

import createUser from "./user/create";

export default class Service {
  private constructor() {}

  static moment = {
    convertRows,
    get,
    getReactions,
    updateTrendScore: updateMomentTrendScore,
    getTrendings: getTrendingMoments,
    post,
    react,
  };

  static topic = {
    create: createTopic,
    increaseUsage,
    updateTrendScore: updateTopicTrendScore,
    getTrendings: getTrendingTopics,
    search,
  };

  static user = {
    create: createUser,
  };
}
