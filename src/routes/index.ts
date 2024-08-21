import { FastifyInstance, FastifySchema, FastifyServerOptions } from "fastify";
import sharp from "sharp";
import { hashObject } from "../lib/crypto";
import zlib from "zlib";
import envars from "../lib/env";
import extractOptimalImageFormat from "../lib/extractOptimalImageFormat";

const validationSchema: FastifySchema = {
	params: {
		type: "object",
		required: ["*"],
		properties: {
			"*": {
				type: "string"
			}
		}
	},
	querystring: {
		type: "object",
		properties: {
			w: {
				type: "number"
			},
			h: {
				type: "number"
			},
			bw: {
				type: "boolean",
				default: false
			},
			blur: {
				type: "number",
				default: undefined,
				minimum: 0,
				maximum: 64
			},
			s: {
				type: "number",
				default: undefined,
				minimum: 0.01,
				maximum: 10
			},
			r: {
				type: "number",
				default: 0,
				minimum: -360,
				maximum: 360
			},
			f: {
				type: "string",
				enum: ["png", "webp", "jpeg", "jpg", "avif", "jxl"]
			},
			c: {
				type: "string",
				enum: ["cover", "contain", "fill"],
				default: "cover"
			},
			ar: {
				type: "string",
				pattern: "^[0-9]*:[0-9]*$" // /^\d*:\d*$/gm
			},
			q: {
				type: "number",
				default: 45,
				minimum: 1,
				maximum: 100
			}
		}
	}
};

const routes = async (app: FastifyInstance, opts: FastifyServerOptions) => {
	app.route({
		method: "GET",
		url: "/*",
		schema: validationSchema,
		handler: async (req, res) => {
			const imageKey = (req.params as any)["*"];

			if (!imageKey) {
				throw new Error("Missing image key");
			}

			const { f, q, bw, w, blur, h, s, r, c } = req.query as any;

			const imageFormat = f ? f : extractOptimalImageFormat(req.headers.accept);

			// Get image stream
			const imageStream = await global.storageAdapter.getItem(imageKey);

			if (!imageStream) {
				return res.status(404).send();
			}

			// Handle error
			imageStream.on("error", (err: StreamError) => {
				imageStream?.destroy(err);

				if (err.hasOwnProperty("code")) {
					if (err.code === "ENOENT") {
						return res.status(404).send();
					}
				}

				return res.status(500).send();
			});

			// Start image pipeline
			const imagePipeline = sharp();

			if (w || h) {
				imagePipeline.resize({
					width: w,
					height: h,
					withoutEnlargement: false,
					withoutReduction: false,
					fastShrinkOnLoad: true,
					kernel: "lanczos3",
					fit: c
				});
			}

			if (s) {
				imagePipeline.sharpen(s);
			}

			if (r) {
				imagePipeline.rotate(r);
			}

			if (blur) {
				imagePipeline.blur(blur);
			}

			if (bw) {
				imagePipeline.grayscale(bw);
			}

			imagePipeline.toFormat(imageFormat, { quality: q, optimiseCoding: true, progressive: true });

			// Pipe image stream to pipeline
			imageStream.pipe(imagePipeline);

			// Set vary header
			res.header("Vary", "accept");

			if (envars.isDev) {
				res.header("Cache-Control", `private, max-age=30`);
			} else {
				res.header("Cache-Control", `private, max-age=${envars.CACHE_MAXAGE}`);
			}

			return res.send(imagePipeline);
		}
	});
};

export default routes;
