import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';

export const uploadScanImage = async (
  uid: string, 
  scanId: string, 
  base64Image: string
): Promise<{ downloadURL: string; storagePath: string }> => {
  try {
    const storagePath = `scans/${uid}/${scanId}.jpg`;
    const storageRef = ref(storage, storagePath);
    
    // uploadString automatically decodes data_url (e.g. data:image/jpeg;base64,...)
    await uploadString(storageRef, base64Image, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    
    return { downloadURL, storagePath };
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw error;
  }
};
