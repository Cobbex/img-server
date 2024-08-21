import { config } from "dotenv";
import { cleanEnv, num, port, str } from "envalid";
import path from "path";

// Load envs
config({
	path: path.resolve(process.cwd(), ".env")
});

const envars = cleanEnv(process.env, {
	// Server
	CACHE_MAXAGE: num({
		default: 3600
	}),
	PORT: port({
		default: 80
	}),
	// Source
	SOURCE_ADAPTER: str({
		default: "fs",
		choices: ["fs", "url", "s3"]
	}),
	// FS
	SOURCE_FS_BASE_PATH: str({
		default: undefined
	}),
	// S3
	SOURCE_S3_API_VERSION: str({
		default: undefined
	}),
	SOURCE_S3_ENDPOINT: str({
		default: undefined
	}),
	SOURCE_S3_BUCKET: str({
		default: undefined
	})
});

export default envars;
