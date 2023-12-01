import type AppCache from "../src/lib/cache";
import type BaseStorageAdapter from "../src/lib/storage/base-storage-adapter";

declare global {
	var storageAdapter: BaseStorageAdapter;
	var appCache: AppCache;
}
