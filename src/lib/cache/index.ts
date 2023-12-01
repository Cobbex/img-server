import AppCacheProvider from "./base";

type AppCacheConfig = {
	provider: AppCacheProvider;
};

class AppCache implements AppCacheProvider {
	private provider: AppCacheProvider;

	constructor(config: AppCacheConfig) {
		this.provider = config.provider;
	}

	async get(key: string) {
		return this.provider.get(key);
	}

	async getBuffer(key: string) {
		return this.provider.getBuffer(key);
	}

	async getAll() {
		return this.provider.getAll();
	}

	async has(key: string) {
		return this.provider.has(key);
	}

	async set(key: string, data: any) {
		return this.provider.set(key, data);
	}

	async clear() {
		await this.provider.clear();
	}

	async init() {
		if (!this.provider.init) {
			return;
		}

		return this.provider.init();
	}
}

export default AppCache;
