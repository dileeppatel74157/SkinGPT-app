import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  onIdTokenChanged
} from 'firebase/auth';
import { auth, googleSignIn, logout as firebaseLogout } from '../utils/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  


  useEffect(() => {
    // onIdTokenChanged triggers on sign-in, sign-out, and token refresh events.
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
        } catch (e) {
          console.error("Error fetching user ID token:", e);
          setIdToken(null);
        }
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const signup = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Automatically send email verification on sign up
      await sendEmailVerification(result.user);
      return result.user;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      setUser(null);
      setIdToken(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await googleSignIn();
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setUser(updatedUser);
      const token = await updatedUser.getIdToken(true);
      setIdToken(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        idToken,
        login,
        signup,
        logout,
        loginWithGoogle,
        resetPassword,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
