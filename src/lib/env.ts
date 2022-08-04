import dotenv from "dotenv";
import path from "path";
dotenv.config({
	path: path.resolve(process.cwd(), ".env")
});

const getEnv = <T = string>(envName: string): T | undefined => {
	return (process.env as any)[envName];
};

export default getEnv;
