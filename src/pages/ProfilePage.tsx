import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Appointment } from "../types/appointment";

const ProfilePage = () => {
  interface User {
    uid: string;
    displayName?: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
          const q = query(
            appointmentsRef,
            where("userId", "==", (currentUser as User).uid)
          );
          const snapshot = await getDocs(q);
          const appointmentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointments(appointmentsData as Appointment[]);
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
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 mb-4">
            Please log in to view your profile.
          </p>
          <a
            href="/auth"
            className="inline-flex rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            Go to Login
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
                {user.displayName || "Welcome"}
              </h1>
              <p className="text-slate-600 mt-1">{user.email}</p>
              <p className="text-xs text-slate-500 mt-2">User ID: {user.uid}</p>
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
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Your Appointments
          </h2>
          <p className="text-slate-600">
            Manage and track all your eye exam bookings here.
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
                    {appointment.status
                      ? appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)
                      : "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg text-slate-600 mb-4">No appointments yet</p>
            <p className="text-sm text-slate-500 mb-4">
              Book an eye exam to get started
            </p>
            <a
              href="/exam"
              className="inline-flex rounded-lg bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              Book an Appointment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
