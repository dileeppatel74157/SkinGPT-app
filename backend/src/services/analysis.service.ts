import { generateSkinAnalysis } from './gemini.service';
import { getAvailableProducts } from './storage.service';

export async function runSkinAnalysis(image: { buffer: Buffer; mimeType: string }, requestId: string) {
  const imagePart = {
    inlineData: {
      mimeType: image.mimeType,
      data: image.buffer.toString('base64')
    }
  };

  const availableProducts = await getAvailableProducts();
  return await generateSkinAnalysis(imagePart, availableProducts, requestId);
}
