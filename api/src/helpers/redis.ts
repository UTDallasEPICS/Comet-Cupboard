import Redis from "ioredis";
import Redlock from "redlock";

// connect to redis
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
export const REDIS_PREFIX = process.env.REDIS_PREFIX || "redis:";

// create redis instance
export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  keyPrefix: REDIS_PREFIX,
  lazyConnect: true
});
(async () => {
  try {
    await redis.connect();
    console.log(`[redis] Connected on ${REDIS_HOST}:${REDIS_PORT}`);
  } catch (e) {
    console.error("[redis] Failed to connect", e);
    process.exit(1);
  }
})();

// setup redlock
const redisClients = [redis];
export const redlock = new Redlock(redisClients, {
  retryCount: 10,
  retryDelay: 200, // ms
  retryJitter: 200 // ms
});