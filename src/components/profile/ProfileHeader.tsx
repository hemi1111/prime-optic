import { useTranslation } from "../../hooks/useTranslation";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

interface ProfileHeaderProps {
  user: User;
  isSigningOut: boolean;
  onSignOut: () => void;
}

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

const ProfileHeader = ({
  user,
  isSigningOut,
  onSignOut,
}: ProfileHeaderProps) => {
  const { t } = useTranslation();

  return (
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
          onClick={onSignOut}
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
  );
};

export default ProfileHeader;
