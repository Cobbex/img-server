import { BaseStorageAdapter } from "../base-storage-adapter";
import { Readable } from "stream";
import axios from "axios";
import redisClient from "../../redis";
import { gzipSync } from "zlib";

class URLStorageAdapter implements BaseStorageAdapter {
	constructor() {}

	getCacheKey(key: string) {
		return `url_storage_adapter__${key}`;
	}

	async getByKey(url: string): Promise<Buffer | undefined> {
		const cacheKey = this.getCacheKey(url);
		const possibleCachedImage = await redisClient.getBuffer(cacheKey);

		if (possibleCachedImage) {
			return possibleCachedImage;
		}

		const imageRequest = await axios({
			method: "GET",
			url: url,
			maxRedirects: 5,
			responseType: "arraybuffer"
		});

		const fetchedImageBuffer = Buffer.from(imageRequest.data, "binary");

		const compressedBuffer = gzipSync(fetchedImageBuffer);

		await redisClient.set(`url_storage_adapter__${url}`, compressedBuffer);

		return compressedBuffer;
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
