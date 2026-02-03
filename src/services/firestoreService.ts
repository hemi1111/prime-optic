import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Product } from "../types/product";

export const getProductsFromFirestore = async (): Promise<Product[]> => {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      products.push({ ...data, id: doc.id });
    });

    return products;
  } catch (error) {
    console.error("Failed to get products from Firestore:", error);
    throw error;
  }
};
