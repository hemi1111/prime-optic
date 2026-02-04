import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../services/authService";
import { queryOrdersByUser } from "../services/orderService";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

import type { Appointment } from "../types/appointment";
import type { Order } from "../types/product";

import {
  ProfileHeader,
  AppointmentsSection,
  OrdersSection,
} from "../components/profile";

const ProfilePage = () => {
  const { t } = useTranslation();
  interface User {
    uid: string;
    displayName?: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser as User);

        if (currentUser && db) {
          const appointmentsRef = collection(db, "appointments");
          const appointmentsQuery = query(
            appointmentsRef,
            where("userId", "==", (currentUser as User).uid)
          );
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointments(appointmentsData as Appointment[]);

          const ordersData = await queryOrdersByUser((currentUser as User).uid);
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500 mb-4"></div>
          <p className="text-slate-600">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 mb-4">
            {t("profile.loginRequired")}
          </p>
          <a
            href="/auth"
            className="inline-flex rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            {t("profile.goToLogin")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />
      <AppointmentsSection appointments={appointments} />
      <OrdersSection orders={orders} />
    </div>
  );
};

export default ProfilePage;
