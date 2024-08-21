import delve from "dlv";

const IMAGE_MIMETYPE_RANKS = {
	"image/jxl": 1,
	"image/avif": 2,
	"image/webp": 3,
	"image/jpg": 4,
	"image/png": 5
};

const imageFormatRegex = /image\/*/;

const extractOptimalImageFormat = (acceptHeader?: string) => {
	if (!acceptHeader) {
		return;
	}

	const imageMimeTypesInAcceptHeader = acceptHeader.split(",").filter((acceptValue) => imageFormatRegex.test(acceptValue));

	const rankedImageFormats = imageMimeTypesInAcceptHeader
		.map((mimeType) => {
			const mimeTypeRank = delve(IMAGE_MIMETYPE_RANKS, mimeType, 99);

			return {
				mimeType: mimeType,
				imageFormat: mimeType.replace("image/", ""),
				rank: mimeTypeRank
			};
		})
		.sort((a, b) => a.rank - b.rank);

	const optimalImageFormat = rankedImageFormats[0];

	return optimalImageFormat.imageFormat;
};

export default extractOptimalImageFormat;
