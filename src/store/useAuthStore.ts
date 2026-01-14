import { create } from "zustand";
import { type AuthUser } from "../types/auth";
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { app } from "../config/firebase";

type AuthState = {
  user: AuthUser | null;
  signOut: () => Promise<void>;
};

let authInitialized = false;

export const useAuthStore = create<AuthState>((set) => {
  // Initialize Firebase auth listener on first store creation
  if (!authInitialized && app) {
    authInitialized = true;
    const auth = getAuth(app);

    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined,
          },
        });
      } else {
        set({ user: null });
      }
    });
  }

  return {
    user: null,
    signOut: async () => {
      try {
        const auth = getAuth(app!);
        await firebaseSignOut(auth);
        set({ user: null });
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    },
  };
});
