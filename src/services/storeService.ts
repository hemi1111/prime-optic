import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { storeLocationsSeed } from "../data/storeLocations";
import type { StoreLocation } from "../data/storeLocations";

const COLLECTION = "stores";

function withoutUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function fetchStores(): Promise<StoreLocation[]> {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as StoreLocation[];
}

export async function createStore(
  data: Omit<StoreLocation, "id">
): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  const ref = await addDoc(collection(db, COLLECTION), {
    ...withoutUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateStore(
  id: string,
  data: Partial<Omit<StoreLocation, "id">>
): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  await updateDoc(doc(db, COLLECTION, id), {
    ...withoutUndefined(data),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStore(id: string): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Populate Firestore with seed stores (ids "1"-"5" to match product storeStock). */
export async function populateSampleStores(): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  const col = collection(db, COLLECTION);
  for (let i = 0; i < storeLocationsSeed.length; i++) {
    const id = String(i + 1);
    await setDoc(doc(col, id), {
      ...storeLocationsSeed[i],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
