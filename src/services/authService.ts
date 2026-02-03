import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../config/firebase";
import { createUserDocument } from "../utils/userUtils";

if (!app) {
  throw new Error("Firebase app is not initialized.");
}

const auth = getAuth(app);

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
    }

    if (userCredential.user) {
      await createUserDocument(
        userCredential.user.uid,
        email,
        "user",
        displayName
      );
    }

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user && db) {
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user document if it doesn't exist (for legacy users)
        await createUserDocument(
          userCredential.user.uid,
          userCredential.user.email || email,
          "user",
          userCredential.user.displayName || undefined
        );
      }
    }

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (displayName: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    await updateProfile(user, { displayName });

    if (db) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          displayName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    throw error;
  }
};
