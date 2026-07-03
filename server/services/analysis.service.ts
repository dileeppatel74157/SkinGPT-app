import { generateSkinAnalysis } from './gemini.service';
import { getAvailableProducts } from './storage.service';

/**
 * Splits base64 headers and image data
 */
export const parseBase64Image = (dataString: string) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return {
      mimeType: 'image/jpeg',
      data: dataString
    };
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
};

/**
 * Runs the analysis pipeline: parses image, resolves products database, executes Gemini scanner
 */
export async function runSkinAnalysis(image: string, requestId: string) {
  const { mimeType, data } = parseBase64Image(image);
  const imagePart = {
    inlineData: {
      mimeType,
      data
    }
  };

  const availableProducts = await getAvailableProducts();
  return await generateSkinAnalysis(imagePart, availableProducts, requestId);
}
