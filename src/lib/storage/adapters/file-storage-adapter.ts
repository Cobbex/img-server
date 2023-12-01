import { BaseStorageAdapter } from "../base-storage-adapter";
import { Readable } from "stream";
import { createReadStream } from "fs";
import { readFile, readdir, writeFile } from "fs/promises";
import path, { resolve } from "path";
import getEnv from "../../env";

class FileStorageAdapter implements BaseStorageAdapter {
	basePath: string;

	constructor() {
		this.basePath = getEnv("FILE_STORAGE_ADAPTER__BASE_PATH") || path.join(process.cwd(), "/assets");
	}

	resolvePath(path: string) {
		return resolve(this.basePath, path);
	}

	async getByKey(path: string): Promise<Buffer | undefined> {
		const fileBuffer = await readFile(this.resolvePath(path));

		return Buffer.from(fileBuffer);
	}

	async getByKeyAsStream(path: string): Promise<Readable | undefined> {
		const fileStream = createReadStream(this.resolvePath(path), {
			autoClose: true,
			emitClose: true,
			encoding: "utf-8"
		});

		return fileStream;
	}

	async store(key: string, data: Buffer): Promise<void> {
		return writeFile(this.resolvePath(key), data);
	}

	async getAll() {
		return readdir(this.resolvePath("/"), {
			encoding: "utf-8",
			withFileTypes: false
		});
	}
}

export default FileStorageAdapter;
