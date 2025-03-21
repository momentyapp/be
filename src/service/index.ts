import convertMomentRows from "./moment/convertRows";
import get from "./moment/get";
import getReactions from "./moment/getReactions";
import getTrendingMoments from "./moment/getTrendings";
import post from "./moment/post";
import react from "./moment/react";
import updateMomentTrendScore from "./moment/updateTrendScore";
import getById from "./moment/getById";
import getByIds from "./moment/getByIds";

import createTopic from "./topic/create";
import increaseUsage from "./topic/increaseUsage";
import updateTopicTrendScore from "./topic/updateTrendScore";
import getTrendingTopics from "./topic/getTrendings";
import search from "./topic/search";
import generateTopics from "./topic/generateTopics";

import createUser from "./user/create";
import getUser from "./user/get";

import createToken from "./auth/createToken";
import refreshToken from "./auth/refreshToken";
import covertUserRows from "./user/convertRows";

export default class Service {
  private constructor() {}

  static moment = {
    convertRows: convertMomentRows,
    get,
    getReactions,
    updateTrendScore: updateMomentTrendScore,
    getTrendings: getTrendingMoments,
    post,
    react,
    getById,
    getByIds,
  };

  static topic = {
    create: createTopic,
    increaseUsage,
    updateTrendScore: updateTopicTrendScore,
    getTrendings: getTrendingTopics,
    generate: generateTopics,
    search,
  };

  static user = {
    create: createUser,
    get: getUser,
    convertRows: covertUserRows,
  };

  static auth = {
    createToken,
    refreshToken,
  };
}
