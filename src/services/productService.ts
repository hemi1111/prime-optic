import {
  collection,
  getDocs,
  limit,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getBrandNameBySlug } from "../config/brands";
import type { Product, ProductType } from "../types/product";

export async function fetchProductsByType(
  type: ProductType,
): Promise<Product[]> {
  if (!db) {
    return [];
  }

  const productsCol = collection(db, "products");
  const q = query(productsCol, where("type", "==", type), limit(24));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Product,
  );
}

export async function fetchProductsByBrand(
  brandSlug: string,
): Promise<Product[]> {
  if (!db) {
    return [];
  }

  const brandName = getBrandNameBySlug(brandSlug);
  if (!brandName) {
    return [];
  }

  const productsCol = collection(db, "products");
  const q = query(
    productsCol,
    where("brand", "==", brandName),
    where("type", "in", ["glasses", "sunglasses"]),
    limit(48),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Product,
  );
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!db) {
    return null;
  }

  const productsCol = collection(db, "products");
  const q = query(productsCol, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    ...(doc.data() as Product),
    id: doc.id,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!db) {
    return [];
  }

  const productsCol = collection(db, "products");
  const q = query(productsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Product,
  );
}

export async function createProduct(
  productData: Omit<Product, "id">,
): Promise<string> {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const productsCol = collection(db, "products");
  const docRef = await addDoc(productsCol, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>,
): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const productRef = doc(db, "products", id);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
}
