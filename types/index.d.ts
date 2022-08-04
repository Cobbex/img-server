import BaseStorageAdapter from "../src/lib/storage/base-storage-adapter";

declare global {
	const storageAdapter: BaseStorageAdapter;
}

export {};
