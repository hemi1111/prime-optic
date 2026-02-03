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

  const getInitials = (name: string | undefined, email: string): string => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
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
      {/* Header with Avatar */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-slate-50 p-8 shadow-soft ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {getInitials(user.displayName, user.email)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {user.displayName || t("profile.welcome")}
              </h1>
              <p className="text-slate-600 mt-1">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSigningOut && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></span>
            )}
            {isSigningOut ? t("profile.signingOut") : t("profile.signOut")}
          </button>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("profile.appointments.title")}
          </h2>
          <p className="text-slate-600">
            {t("profile.appointments.description")}
          </p>
        </div>

        {appointments.length > 0 ? (
          <div className="mt-6 space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">
                      📅 {appointment.date}
                    </span>
                    <span className="text-sm text-slate-600">
                      🕐 {appointment.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Appointment ID: {appointment.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appointment.status === "confirmed"
                      ? t("profile.appointments.confirmed")
                      : appointment.status === "pending"
                      ? t("profile.appointments.pending")
                      : t("profile.appointments.cancelled")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg text-slate-600 mb-4">
              {t("profile.appointments.none")}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {t("profile.appointments.noneDescription")}
            </p>
            <a
              href="/exam"
              className="inline-flex rounded-lg bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              {t("profile.appointments.bookAppointment")}
            </a>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("profile.orders.title")}
          </h2>
          <p className="text-slate-600">{t("profile.orders.description")}</p>
        </div>

        {orders.length > 0 ? (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {t("profile.orders.order")} #
                      {order.id?.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.createdAt?.toDate?.()?.toLocaleDateString() ||
                        "Recently placed"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "confirmed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.status === "delivered"
                      ? t("profile.orders.status.delivered")
                      : order.status === "shipped"
                      ? t("profile.orders.status.shipped")
                      : order.status === "confirmed"
                      ? t("profile.orders.status.confirmed")
                      : t("profile.orders.status.pending")}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div>
                    <strong>{t("profile.orders.items")}:</strong>{" "}
                    {order.items?.length || 0} item(s)
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span>
                      <strong>{t("profile.orders.delivery")}:</strong>{" "}
                      {order.deliveryInfo?.option?.name}
                    </span>
                    <span>
                      <strong>{t("profile.orders.total")}:</strong> €
                      {order.total?.toFixed(2)}
                    </span>
                  </div>
                  {order.deliveryInfo?.option?.id === "home_delivery" &&
                    order.deliveryInfo?.address && (
                      <div className="text-xs text-slate-500">
                        <strong>{t("profile.orders.address")}:</strong>{" "}
                        {order.deliveryInfo.address.street},{" "}
                        {order.deliveryInfo.address.city}
                      </div>
                    )}
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2 text-amber-800">
                    <span>💰</span>
                    <span className="text-xs font-medium">
                      {t("profile.orders.payment")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg text-slate-600 mb-4">
              {t("profile.orders.none")}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {t("profile.orders.noneDescription")}
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="/glasses"
                className="inline-flex rounded-lg bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                {t("cart.browseGlasses")}
              </a>
              <a
                href="/sunglasses"
                className="inline-flex rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {t("cart.browseSunglasses")}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
