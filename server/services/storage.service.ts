import { getFirestore } from 'firebase-admin/firestore';
import { PRODUCTS_DATABASE } from '../../src/data/products';

/**
 * Returns available products from Firestore database (seeds them if empty)
 */
export const getAvailableProducts = async () => {
  const firestoreDb = getFirestore();
  const snapshot = await firestoreDb.collection('products').get();
  if (snapshot.empty) {
    console.log('Seeding products database on backend...');
    const batch = firestoreDb.batch();
    for (const p of PRODUCTS_DATABASE) {
      const docRef = firestoreDb.collection('products').doc(p.id);
      batch.set(docRef, p);
    }
    await batch.commit();
    return PRODUCTS_DATABASE;
  }
  return snapshot.docs.map(doc => doc.data());
};

/**
 * Increments scan/chat usage statistics for rate-limiting check
 */
export const incrementUsage = async (uid: string, type: 'scan' | 'chat') => {
  const firestoreDb = getFirestore();
  const userRef = firestoreDb.collection('users').doc(uid);
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    await firestoreDb.runTransaction(async (transaction) => {
      const docSnap = await transaction.get(userRef);
      const data = docSnap.exists ? (docSnap.data() || {}) : {};
      
      const usage = data.usage || {
        totalScans: 0,
        scansToday: 0,
        chatMessages: 0,
        lastScanDate: '',
        storageUsed: 0,
        chatsToday: 0,
        lastChatDate: ''
      };
      
      const subscription = data.subscription || {
        plan: 'Free',
        status: 'active',
        scansRemaining: 5,
        expiresAt: ''
      };

      if (type === 'scan') {
        usage.totalScans = (usage.totalScans || 0) + 1;
        if (usage.lastScanDate === todayStr) {
          usage.scansToday = (usage.scansToday || 0) + 1;
        } else {
          usage.scansToday = 1;
          usage.lastScanDate = todayStr;
        }
        if (subscription.scansRemaining > 0) {
          subscription.scansRemaining = subscription.scansRemaining - 1;
        }
      } else if (type === 'chat') {
        usage.chatMessages = (usage.chatMessages || 0) + 1;
        if (usage.lastChatDate === todayStr) {
          usage.chatsToday = (usage.chatsToday || 0) + 1;
        } else {
          usage.chatsToday = 1;
          usage.lastChatDate = todayStr;
        }
      }

      transaction.set(userRef, { usage, subscription }, { merge: true });
    });
  } catch (error) {
    console.error('Error incrementing usage in transaction:', error);
  }
};
