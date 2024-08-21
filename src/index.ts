import "./lib/env";
import envars from "./lib/env";
import Server from "./server";

(async () => {
	const server = new Server(envars.PORT);

	await server.start();
})();
