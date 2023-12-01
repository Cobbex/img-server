import { FastifyInstance, FastifyServerOptions } from "fastify";

const routes = async (app: FastifyInstance, opts: FastifyServerOptions) => {
	app.route({
		method: "POST",
		url: "/",
		handler: async (req, res) => {
			res.compress("Alive and well!");
		}
	});
};

export default routes;
