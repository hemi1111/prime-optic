import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import type { AuthUser } from "../types/auth";

/**
 * Gets user data from Firestore
 */
export const getUserData = async (userId: string): Promise<AuthUser | null> => {
  if (!db) {
    console.error("Firestore not initialized");
    return null;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userId,
        email: userData.email || "",
        displayName: userData.displayName || undefined,
        role: userData.role || "user",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const createUserDocument = async (
  userId: string,
  email: string,
  role: "admin" | "user" = "user",
  displayName?: string
) => {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      email,
      role,
      displayName: displayName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

export const makeUserAdmin = async (userId: string) => {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        role: "admin",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
};
