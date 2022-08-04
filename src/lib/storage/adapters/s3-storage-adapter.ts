import { BaseStorageAdapter } from "../base-storage-adapter";
import { GetObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import getEnv from "../../env";

class S3StorageAdapter implements BaseStorageAdapter {
	bucket?: string;
	s3: S3Client;

	constructor() {
		this.s3 = new S3Client({
			apiVersion: getEnv("S3_STORAGE_ADAPTER__API_VERSION"),
			endpoint: getEnv("S3_STORAGE_ADAPTER__ENDOINT")
		});
		this.bucket = getEnv("S3_STORAGE_ADAPTER__BUCKET");
	}

	async getByKey(key: string): Promise<Buffer | undefined> {
		const response = await this.s3.send(
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		);

		const stream = response.Body as Readable;

		return new Promise<Buffer>((resolve, reject) => {
			const chunks: Buffer[] = [];

			stream.on("data", (chunk) => chunks.push(chunk));

			stream.once("end", () => resolve(Buffer.concat(chunks)));

			stream.once("error", reject);
		});
	}

	async getByKeyAsStream(key: string): Promise<Readable | undefined> {
		const response = await this.s3.send(
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		);

		return response.Body as Readable;
	}

	async store(key: string, data: Buffer): Promise<void> {
		throw new Error("Not implemented");
	}
}

export default S3StorageAdapter;
