const pascalCaseToKebabCase = (str: string) => str.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();

const LoadStorageModule = async (storageLoaderName?: string) => {
	if (!storageLoaderName) {
		throw new Error("No storage loader name passed!");
	}

	const convertedStorageModuleName = pascalCaseToKebabCase(storageLoaderName);

	const storageLoader = await import(`./adapters/${convertedStorageModuleName}`);

	return storageLoader.default;
};

export default LoadStorageModule;
