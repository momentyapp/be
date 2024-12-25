import * as redis from "redis";

import * as moment from "./moment";

export const redisClient = redis.createClient();
redisClient.connect();

const cache = { moment };
export default cache;
