import crypto from "crypto";
import objectHash from "object-hash";

export const md5FromBuffer = (data: string) => {
	return crypto.createHash("md5").update(data).digest("hex");
};

export const hashObject = (data: any) => {
	return objectHash(data);
};
