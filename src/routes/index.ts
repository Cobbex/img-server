import { FastifyInstance, FastifySchema, FastifyServerOptions } from "fastify";
import sharp from "sharp";
import redisClient from "../lib/redis";
import { hashObject } from "../lib/crypto";
import { gunzipSync, gzipSync } from "zlib";
import isGzip from "is-gzip";

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
				minimum: 0.3,
				maximum: 128
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
				enum: ["png", "webp", "jpeg", "jpg", "heif", "avif"],
				default: "webp"
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

			const { f, q, bw, w, blur, h, s, r, c } = req.query;

			const imageCacheKey = hashObject({
				key: imageKey,
				settings: req.query
			});

			const cachedTransformedImage = await redisClient.getBuffer(imageCacheKey);

			if (cachedTransformedImage && Buffer.isBuffer(cachedTransformedImage)) {
				app.log.info("Serving cached data!");

				if (isGzip(cachedTransformedImage)) {
					const decompressedCachedFile = gunzipSync(cachedTransformedImage);

					return res.header("Cache-Control", "private, max-age=120").type(`image/${f}`).compress(decompressedCachedFile);
				}

				return res.header("Cache-Control", "private, max-age=120").type(`image/${f}`).compress(cachedTransformedImage);
			}

			const fetchedImageBuffer = await global.storageAdapter.getByKey(imageKey);

			const imagePipeline = sharp(fetchedImageBuffer);

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

			imagePipeline.toFormat(f || "webp", { quality: q, optimiseCoding: true, progressive: true });

			const transformedBuffer = await imagePipeline.toBuffer();

			const compressedBuffer = gzipSync(transformedBuffer);

			await redisClient.set(imageCacheKey, compressedBuffer);

			res.header("Cache-Control", "private, max-age=120").type(`image/${f}`).compress(transformedBuffer);
		}
	});
};

export default routes;
