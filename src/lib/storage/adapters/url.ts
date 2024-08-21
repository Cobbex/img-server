import { BaseStorageAdapter } from "../base-storage-adapter";
import { Readable } from "stream";
import axios from "axios";
import { gunzipSync, gzipSync } from "zlib";
import { hashObject, simpleHash } from "../../crypto";

class RemoteURLStorageAdapter implements BaseStorageAdapter {
	constructor() {}

	getCacheKey(key: string) {
		return `url_storage_adapter__${key}`;
	}

	async getItem(url: string): Promise<Readable | undefined> {
		const imageRequest = await axios({
			method: "GET",
			url: url,
			maxRedirects: 5,
			responseType: "stream"
		});

		return imageRequest.data as Readable;
	}

	async setItem(key: string, data: Buffer): Promise<void> {
		throw new Error("Not implemented");
	}
}

export default RemoteURLStorageAdapter;
