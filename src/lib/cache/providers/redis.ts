import getEnv from "../../env";
import AppCacheProvider from "../base";
import IORedis from "ioredis";

class RedisAppCacheProvider implements AppCacheProvider {
	redisClient: IORedis;

	constructor() {
		this.redisClient = new IORedis({
			host: getEnv("REDIS_HOST"),
			port: getEnv<number>("REDIS_PORT") || 6379,
			password: getEnv("REDIS_PASSWORD")
		});
	}

	async get(key: string) {
		return this.redisClient.get(key);
	}

	async getBuffer(key: string) {
		return this.redisClient.getBuffer(key);
	}

	async getAll() {
		return this.redisClient.scan("*");
	}

	async has(key: string) {
		return !!this.redisClient.get(key);
	}

	async set(key: string, data: any) {
		this.redisClient.set(key, data);
	}

	async clear() {
		await this.redisClient.flushdb();
	}

	async init() {
		return this.redisClient.connect();
	}
}

export default RedisAppCacheProvider;
