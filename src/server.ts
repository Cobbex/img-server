import Fastify, { FastifyInstance } from "fastify";
import routes from "./routes";
import getEnv from "./lib/env";
import fastifyCompress from "@fastify/compress";
import LoadStorageModule from "./lib/storage/storage-loader";
import AppCache from "./lib/cache";
import MemoryAppCacheProvider from "./lib/cache/providers/memory";
import FileAppCacheProvider from "./lib/cache/providers/file";

class Server {
	app: FastifyInstance;
	port: number = 8000;

	constructor(port: number) {
		this.app = Fastify({
			logger: {
				transport:
					getEnv("NODE_ENV") === "development"
						? {
								target: "pino-pretty",
								options: {
									translateTime: "HH:MM:ss Z",
									colorize: true,
									ignore: "pid,hostname"
								}
						  }
						: undefined
			}
		});
		this.port = port;
	}

	async start() {
		try {
			const StorageAdapter = await LoadStorageModule(getEnv("STORAGE_ADAPTER"));

			this.app.log.info(`Storage module loaded: "${getEnv("STORAGE_ADAPTER")}"`);

			global.storageAdapter = new StorageAdapter();

			global.appCache = new AppCache({
				// provider: new FileAppCacheProvider("cache")
				provider: new MemoryAppCacheProvider()
			});

			await global.appCache.init();

			await this.app.register(fastifyCompress, {
				global: true
			});

			this.app.get("/", async (req, res) => {
				return {
					message: "Server online!"
				};
			});

			await this.app.register(routes, { prefix: "api/v1" });

			await this.app.listen({ port: this.port || 8000 });
		} catch (err) {
			this.app.log.error(err);

			process.exit(1);
		}
	}
}

export default Server;
