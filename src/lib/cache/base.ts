interface AppCacheProvider<T = any> {
	get: (key: string) => Promise<T | null>;
	getBuffer: (key: string) => Promise<Buffer | null>;
	getAll: () => Promise<T[]>;
	has: (key: string) => Promise<boolean>;
	set: (key: string, data: any) => Promise<void>;
	clear: () => Promise<void>;
	init?: () => Promise<void>;
}

export default AppCacheProvider;
