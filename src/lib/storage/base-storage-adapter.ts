import { Readable } from "stream";

export interface BaseStorageAdapter {
	getItem: (key: string) => Promise<Readable | undefined>;
	setItem?: (key: string, data: Buffer) => Promise<void>;
}

export default BaseStorageAdapter;
