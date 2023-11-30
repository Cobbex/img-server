import { BaseStorageAdapter } from "../base-storage-adapter";
import { Readable } from "stream";
import axios from "axios";
import redisClient from "../../redis";
import { gunzipSync, gzipSync } from "zlib";
import { hashObject, simpleHash } from "../../crypto";

class URLStorageAdapter implements BaseStorageAdapter {
	constructor() {}

	getCacheKey(key: string) {
		return `url_storage_adapter__${key}`;
	}

	async getByKey(url: string): Promise<Buffer | undefined> {
		const cacheKey = this.getCacheKey(simpleHash(url));
		const possibleCachedImage = await redisClient.getBuffer(cacheKey);

		if (possibleCachedImage) {
			return gunzipSync(possibleCachedImage);
		}

		const imageRequest = await axios({
			method: "GET",
			url: url,
			maxRedirects: 5,
			responseType: "arraybuffer"
		});

		const fetchedImageBuffer = Buffer.from(imageRequest.data, "binary");

		const compressedBuffer = gzipSync(fetchedImageBuffer);

		await redisClient.set(cacheKey, compressedBuffer);

		return fetchedImageBuffer;
	}

	async getByKeyAsStream(url: string): Promise<Readable | undefined> {
		const imageRequest = await axios({
			method: "GET",
			url: url,
			maxRedirects: 5,
			responseType: "stream"
		});

		return imageRequest.data as Readable;
	}

	async store(key: string, data: Buffer): Promise<void> {
		throw new Error("Not implemented");
	}
}

export default URLStorageAdapter;
