import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { UserProfile, SkinScan, CabinetItem, ChatMessage, Product } from '../types';
import { PRODUCTS_DATABASE } from '../data/products';

// -------------------------------------------------------------
// USER PROFILE OPERATIONS
// -------------------------------------------------------------

export const getUserProfile = async (uid: string): Promise<any | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile & {
  settings?: any;
  usage?: any;
  subscription?: any;
  updatedAt?: string;
  createdAt?: string;
}>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// -------------------------------------------------------------
// SCAN HISTORY OPERATIONS
// -------------------------------------------------------------

export const saveScan = async (uid: string, scan: SkinScan): Promise<void> => {
  try {
    const scanRef = doc(db, 'users', uid, 'scans', scan.id);
    await setDoc(scanRef, {
      ...scan,
      timestamp: scan.date || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving scan report:', error);
    throw error;
  }
};

export const getScans = async (uid: string): Promise<SkinScan[]> => {
  try {
    const scansCol = collection(db, 'users', uid, 'scans');
    const q = query(scansCol, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const scans: SkinScan[] = [];
    querySnapshot.forEach((doc) => {
      scans.push(doc.data() as SkinScan);
    });
    return scans;
  } catch (error) {
    console.error('Error loading scans:', error);
    throw error;
  }
};

// -------------------------------------------------------------
// CABINET OPERATIONS
// -------------------------------------------------------------

export const addCabinetItem = async (uid: string, item: CabinetItem): Promise<void> => {
  try {
    const itemRef = doc(db, 'users', uid, 'cabinet', item.id);
    await setDoc(itemRef, item);
  } catch (error) {
    console.error('Error adding cabinet item:', error);
    throw error;
  }
};

export const updateCabinetItem = async (uid: string, itemId: string, itemData: Partial<CabinetItem>): Promise<void> => {
  try {
    const itemRef = doc(db, 'users', uid, 'cabinet', itemId);
    await updateDoc(itemRef, itemData);
  } catch (error) {
    console.error('Error updating cabinet item:', error);
    throw error;
  }
};

export const deleteCabinetItem = async (uid: string, itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'users', uid, 'cabinet', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting cabinet item:', error);
    throw error;
  }
};

export const getCabinetItems = async (uid: string): Promise<CabinetItem[]> => {
  try {
    const cabinetCol = collection(db, 'users', uid, 'cabinet');
    const querySnapshot = await getDocs(cabinetCol);
    const items: CabinetItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as CabinetItem);
    });
    // Sort by addedAt or id as fallback
    return items.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
  } catch (error) {
    console.error('Error fetching cabinet items:', error);
    throw error;
  }
};

// -------------------------------------------------------------
// AI CHAT CONVERSATIONS OPERATIONS (SUBCOLLECTIONS)
// -------------------------------------------------------------

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  lastMessageText: string;
  messages: ChatMessage[];
}

export const createChat = async (uid: string, chatId: string, title: string = 'Consultation'): Promise<void> => {
  try {
    const chatRef = doc(db, 'users', uid, 'chats', chatId);
    await setDoc(chatRef, {
      id: chatId,
      title,
      createdAt: new Date().toISOString(),
      lastMessageText: ''
    });
  } catch (error) {
    console.error('Error creating chat thread:', error);
    throw error;
  }
};

export const appendMessage = async (uid: string, chatId: string, message: ChatMessage): Promise<void> => {
  try {
    // 1. Save message inside subcollection /users/{uid}/chats/{chatId}/messages/{messageId}
    const msgRef = doc(db, 'users', uid, 'chats', chatId, 'messages', message.id);
    await setDoc(msgRef, message);

    // 2. Update parent chat thread with last message text for list index preview
    const chatRef = doc(db, 'users', uid, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessageText: message.text,
      lastUpdatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error appending chat message:', error);
    throw error;
  }
};

export const loadChats = async (uid: string): Promise<ChatThread[]> => {
  try {
    const chatsCol = collection(db, 'users', uid, 'chats');
    const chatsSnap = await getDocs(chatsCol);
    const threads: ChatThread[] = [];

    for (const chatDoc of chatsSnap.docs) {
      const chatData = chatDoc.data();
      const messagesCol = collection(db, 'users', uid, 'chats', chatDoc.id, 'messages');
      const messagesSnap = await getDocs(messagesCol);
      const messages: ChatMessage[] = [];
      
      messagesSnap.forEach((mDoc) => {
        messages.push(mDoc.data() as ChatMessage);
      });

      // Sort messages by timestamp or id
      messages.sort((a, b) => a.id.localeCompare(b.id));

      threads.push({
        id: chatDoc.id,
        title: chatData.title || 'Consultation',
        createdAt: chatData.createdAt || new Date().toISOString(),
        lastMessageText: chatData.lastMessageText || '',
        messages
      });
    }

    // Sort threads by date desc
    return threads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error('Error loading chats:', error);
    throw error;
  }
};

export const deleteChat = async (uid: string, chatId: string): Promise<void> => {
  try {
    // 1. Delete all nested messages first
    const messagesCol = collection(db, 'users', uid, 'chats', chatId, 'messages');
    const messagesSnap = await getDocs(messagesCol);
    
    const batch = writeBatch(db);
    messagesSnap.forEach((mDoc) => {
      batch.delete(mDoc.ref);
    });
    await batch.commit();

    // 2. Delete parent chat doc
    const chatRef = doc(db, 'users', uid, 'chats', chatId);
    await deleteDoc(chatRef);
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

// -------------------------------------------------------------
// PRODUCT DATABASE & RECOMMENDATION
// -------------------------------------------------------------

export const getRecommendedProducts = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, 'products');
    const querySnapshot = await getDocs(productsCol);
    
    // Seed database if empty
    if (querySnapshot.empty) {
      console.log('Product database is empty. Programmatically seeding with default product set...');
      const batch = writeBatch(db);
      for (const p of PRODUCTS_DATABASE) {
        const docRef = doc(db, 'products', p.id);
        batch.set(docRef, p);
      }
      await batch.commit();
      return PRODUCTS_DATABASE;
    }

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    return products;
  } catch (error) {
    console.error('Error fetching global product list:', error);
    // Return local list as fallback in case of Firestore rules blocking global reads
    return PRODUCTS_DATABASE;
  }
};
