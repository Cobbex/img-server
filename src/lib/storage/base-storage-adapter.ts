import { Readable } from "stream";

export interface BaseStorageAdapter {
	getByKey: (key: string) => Promise<Buffer | undefined>;
	getByKeyAsStream: (key: string) => Promise<Readable | undefined>;
	store: (key: string, data: Buffer) => Promise<void>;
}

export default BaseStorageAdapter;
