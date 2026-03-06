import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const MIN_RATING = 1;
const MAX_RATING = 5;

export async function submitReview(
  productId: string,
  userId: string,
  orderId: string,
  rating: number
): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }
  const num = Number(rating);
  if (!Number.isFinite(num) || num < MIN_RATING || num > MAX_RATING) {
    throw new Error(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
  }

  const reviewsCol = collection(db, "reviews");
  const productRef = doc(db, "products", productId);

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }
    const data = productSnap.data();
    const currentRating = typeof data?.rating === "number" ? data.rating : 0;
    const currentCount = typeof data?.reviewCount === "number" ? data.reviewCount : 0;
    const newCount = currentCount + 1;
    const newRating =
      (currentRating * currentCount + num) / newCount;

    transaction.set(doc(reviewsCol), {
      productId,
      userId,
      orderId,
      rating: num,
      createdAt: serverTimestamp(),
    });

    transaction.update(productRef, {
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newCount,
      updatedAt: serverTimestamp(),
    });
  });
}
