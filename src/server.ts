import { fastify, FastifyInstance } from "fastify";
import routes from "./routes";
import fastifyCompress from "@fastify/compress";
import loadStorageModule from "./lib/storage/storage-loader";
import envars from "./lib/env";

class Server {
	app: FastifyInstance;
	port: number = 8000;

	constructor(port: number) {
		this.app = fastify({
			logger: {
				transport: envars.isDev
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
			const StorageAdapter = await loadStorageModule(envars.SOURCE_ADAPTER);

			global.storageAdapter = new StorageAdapter();

			this.app.log.info(`Storage module loaded: "${envars.SOURCE_ADAPTER}"`);

			await this.app.register(fastifyCompress, {
				global: true
			});

			this.app.get("/", async (_req, res) => {
				return res.status(200).send({
					message: "Server online!"
				});
			});

			await this.app.register(routes, { prefix: "api/v1" });

			await this.app.listen({ port: this.port });
		} catch (err) {
			this.app.log.error(err);

			process.exit(1);
		}
	}
}

export default Server;
