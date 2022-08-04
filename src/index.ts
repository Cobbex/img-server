import Server from "./server";

(async () => {
	const server = new Server(8000);

	await server.start();
})();
