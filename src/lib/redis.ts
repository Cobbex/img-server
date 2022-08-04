import IORedis from "ioredis";
import getEnv from "./env";

const redisClient = new IORedis({
	host: getEnv("REDIS_HOST"),
	port: getEnv<number>("REDIS_PORT") || 6379,
	password: getEnv("REDIS_PASSWORD"),
	lazyConnect: true
});

export default redisClient;
