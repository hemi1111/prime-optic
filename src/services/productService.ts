import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Product, ProductType } from '../types/product'

export async function fetchProductsByType(
  type: ProductType,
): Promise<Product[]> {
  if (!db) {
    // Firebase not configured yet – return empty list so UI can show a stable empty state
    return []
  }

  const productsCol = collection(db, 'products')
  const q = query(
    productsCol,
    where('type', '==', type),
    limit(24),
  )
  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Product,
  )
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!db) {
    return null
  }

  const productsCol = collection(db, 'products')
  const q = query(productsCol, where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...(doc.data() as Product),
  }
}


