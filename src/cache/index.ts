import * as redis from "redis";

import getUsage from "./topic/getUsage";
import increaseUsage from "./topic/increaseUsage";
import setTopicTrendScore from "./topic/setTrendScore";
import getTrendingTopics from "./topic/getTrendings";
import getUsageSnapshotAtIndex from "./topic/getUsageSnapshotAtIndex";
import takeUsageSnapshot from "./topic/takeUsageSnapshot";
import trimUsageSnapshot from "./topic/trimUsageSnapshot";
import getTrendRank from "./topic/getTrendRank";

import decreaseReaction from "./moment/decreaseReaction";
import getReaction from "./moment/getReaction";
import getReactionSnapshotAtIndex from "./moment/getReactionSnapshotAtIndex";
import getTrendingMoments from "./moment/getTrendings";
import increaseReaction from "./moment/increaseReaction";
import setMomentTrendScore from "./moment/setTrendScore";
import takeReactionSnapshot from "./moment/takeReactionSnapshot";
import trimReactionSnapshot from "./moment/trimReactionSnapshot";

import saveTopicRecommendation from "./ai/saveTopicRecommendation";
import getTopicRecommendation from "./ai/getTopicRecommendation";

export default class Cache {
  private constructor() {}

  static topic = {
    getUsage,
    increaseUsage,
    setTrendScore: setTopicTrendScore,
    getTrendings: getTrendingTopics,
    getUsageSnapshotAtIndex,
    takeUsageSnapshot,
    trimUsageSnapshot,
    getTrendRank,
  };

  static moment = {
    decreaseReaction,
    getReaction,
    getReactionSnapshotAtIndex,
    getTrendings: getTrendingMoments,
    increaseReaction,
    setTrendScore: setMomentTrendScore,
    takeReactionSnapshot,
    trimReactionSnapshot,
  };

  static ai = {
    saveTopicRecommendation,
    getTopicRecommendation,
  };
}

const redisClient = redis.createClient();
redisClient.connect();

export { redisClient };
