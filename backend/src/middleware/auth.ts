import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

/**
 * Verifies Firebase Client ID Token
 */
export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error: any) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
  }
};

const getUserData = async (uid: string) => {
  const firestoreDb = getFirestore();
  const userRef = firestoreDb.collection('users').doc(uid);
  const docSnap = await userRef.get();
  if (docSnap.exists) {
    return docSnap.data();
  }
  return null;
};

/**
 * Checks usage thresholds against Firestore subscriptions
 */
export const checkRateLimit = (type: 'scan' | 'chat') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.uid) {
      return res.status(401).json({ error: 'Unauthorized: Missing user credentials.' });
    }

    const uid = req.user.uid;
    try {
      const userData = await getUserData(uid);
      const usage = userData?.usage || {};
      const subscription = userData?.subscription || { plan: 'Free' };

      if (subscription.plan === 'Free') {
        const todayStr = new Date().toISOString().split('T')[0];

        if (type === 'scan') {
          const scansToday = usage.lastScanDate === todayStr ? (usage.scansToday || 0) : 0;
          if (scansToday >= 5) {
            return res.status(429).json({ error: 'Rate limit exceeded: Free tier accounts are restricted to 5 scans per day.' });
          }
        } else if (type === 'chat') {
          const chatsToday = usage.lastChatDate === todayStr ? (usage.chatsToday || 0) : 0;
          if (chatsToday >= 20) {
            return res.status(429).json({ error: 'Rate limit exceeded: Free tier accounts are restricted to 20 chats per day.' });
          }
        }
      }
      next();
    } catch (err) {
      console.error('Error in checkRateLimit middleware:', err);
      next(); // Fail-open
    }
  };
};
