const LoadStorageModule = async (storageLoaderName?: string) => {
	if (!storageLoaderName) {
		throw new Error("No storage loader name passed!");
	}

	const storageLoader = await import(`./adapters/${storageLoaderName}`);

	return storageLoader.default;
};

export default LoadStorageModule;
