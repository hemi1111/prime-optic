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
    <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-slate-50 p-6 md:p-8 shadow-soft ring-1 ring-slate-200">
      <div className="flex flex-col gap-6 max-sm:items-stretch sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
            <span className="text-3xl font-bold text-white">
              {getInitials(user.displayName, user.email)}
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
              {user.displayName || t("profile.welcome")}
            </h1>
            <p className="text-slate-600 mt-1 text-sm truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          disabled={isSigningOut}
          className="min-h-[44px] rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 max-sm:w-full sm:shrink-0"
        >
          {isSigningOut && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          )}
          {isSigningOut ? t("profile.signingOut") : t("profile.signOut")}
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
