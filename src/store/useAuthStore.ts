import { create } from "zustand";

import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { app, db } from "../config/firebase";

import { type AuthUser } from "../types/auth";

type AuthState = {
  user: AuthUser | null;
  signOut: () => Promise<void>;
};

let authInitialized = false;

const fetchUserData = async (uid: string): Promise<AuthUser> => {
  if (!db) {
    return {
      id: uid,
      email: "",
      displayName: undefined,
      role: "user",
    };
  }

  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: uid,
        email: userData.email || "",
        displayName: userData.displayName,
        role: userData.role || "user",
      };
    } else {
      return {
        id: uid,
        email: "",
        displayName: undefined,
        role: "user",
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      id: uid,
      email: "",
      displayName: undefined,
      role: "user",
    };
  }
};

export const useAuthStore = create<AuthState>((set) => {
  if (!authInitialized && app) {
    authInitialized = true;
    const auth = getAuth(app);

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        set({
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email || userData.email,
            displayName: firebaseUser.displayName || userData.displayName,
            role: userData.role,
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
