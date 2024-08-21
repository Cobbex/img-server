import { BaseStorageAdapter } from "../base-storage-adapter";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import envars from "../../env";

class S3StorageAdapter implements BaseStorageAdapter {
	bucket?: string;
	s3: S3Client;

	constructor() {
		this.s3 = new S3Client({
			apiVersion: envars.SOURCE_S3_API_VERSION,
			endpoint: envars.SOURCE_S3_ENDPOINT
		});
		this.bucket = envars.SOURCE_S3_BUCKET;
	}

	async getItem(key: string): Promise<Readable | undefined> {
		const response = await this.s3.send(
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		);

		return response.Body as Readable;
	}

	async setItem(key: string, data: Buffer): Promise<void> {
		throw new Error("Not implemented");
	}
}

export default S3StorageAdapter;
