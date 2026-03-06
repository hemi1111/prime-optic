import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Order } from "../types/product";

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!db) {
    console.warn("[Orders] Firestore is not configured.");
    return null;
  }
  const orderRef = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Order;
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "status">,
): Promise<string> {
  if (!db) {
    console.warn("[Orders] Firestore is not configured. Order was not saved.");
    throw new Error(
      "Order system is temporarily unavailable. Please try again later or contact the store by phone.",
    );
  }

  const ordersCol = collection(db, "orders");

  const docRef = await addDoc(ordersCol, {
    ...order,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function queryOrdersByUser(userId: string): Promise<Order[]> {
  if (!db) {
    console.warn("[Orders] Firestore is not configured.");
    return [];
  }

  const ordersCol = collection(db, "orders");
  const q = query(
    ordersCol,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export const deliveryOptions = [
  {
    id: "pickup",
    name: "Store Pickup",
    description: "Pick up from our store - no extra charge",
    price: 0,
    estimatedDays: "1-2 business days",
  },
  {
    id: "home",
    name: "Home Delivery",
    description: "Delivered to your address",
    price: 2,
    estimatedDays: "2-4 business days",
  },
];
