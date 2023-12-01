import { join, resolve } from "path";
import AppCacheProvider from "../base";
import fs from "fs/promises";

class FileAppCacheProvider implements AppCacheProvider {
	basePath: string;

	constructor(cachePath = "cache") {
		this.basePath = join(process.cwd(), "/", cachePath);
	}

	resolvePath(path: string) {
		return resolve(this.basePath, path);
	}

	async get(key: string) {
		try {
			return await fs.readFile(this.resolvePath(key));
		} catch (error) {
			return null;
		}
	}

	async getBuffer(key: string) {
		return this.get(key);
	}

	async getAll() {
		return fs.readdir(this.resolvePath(""), {
			recursive: true,
			withFileTypes: false
		});
	}

	async has(key: string) {
		return !!fs.stat(this.resolvePath(key));
	}

	async set(key: string, data: any) {
		console.log(key);

		await fs.writeFile(this.resolvePath(key), data);
	}

	async clear() {
		await fs.rm(this.resolvePath("*"), {
			force: true,
			recursive: true
		});
	}

	async init() {
		const alreadyExists = await this.has("");

		if (alreadyExists) {
			return;
		}

		await fs.mkdir(this.resolvePath(""), {
			recursive: false
		});
	}
}

export default FileAppCacheProvider;
