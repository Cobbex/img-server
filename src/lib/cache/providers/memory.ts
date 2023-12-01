import AppCacheProvider from "../base";

class MemoryAppCacheProvider implements AppCacheProvider {
	cacheMap = new Map();

	async get(key: string) {
		return this.cacheMap.get(key);
	}

	async getBuffer(key: string) {
		return this.cacheMap.get(key);
	}

	async getAll() {
		return Array.from(this.cacheMap);
	}

	async has(key: string) {
		return this.cacheMap.has(key);
	}

	async set(key: string, data: any) {
		this.cacheMap.set(key, data);
	}

	async clear() {
		this.cacheMap.clear();
	}
}

export default MemoryAppCacheProvider;
