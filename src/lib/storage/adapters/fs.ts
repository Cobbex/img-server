import { BaseStorageAdapter } from "../base-storage-adapter";
import { Readable } from "stream";
import { createReadStream } from "fs";
import path, { resolve } from "path";
import envars from "../../env";

class LocalFileStorageAdapter implements BaseStorageAdapter {
	basePath: string;

	constructor() {
		if (!envars.SOURCE_FS_BASE_PATH) {
			throw new Error("No source base path");
		}

		this.basePath = path.resolve(process.cwd(), envars.SOURCE_FS_BASE_PATH);
	}

	resolvePath(path: string) {
		return resolve(this.basePath, path);
	}

	async getItem(path: string): Promise<Readable | undefined> {
		try {
			const fileStream = createReadStream(this.resolvePath(path), {
				autoClose: true,
				emitClose: true
			});

			return fileStream;
		} catch (error) {
			return;
		}
	}
}

export default LocalFileStorageAdapter;
