import type { FirebaseError } from "firebase/app";

type TranslationFunction = (key: string) => string;

export const getReadableErrorMessage = (
  error: unknown,
  t: TranslationFunction
): string => {
  if (error && typeof error === "object" && "code" in error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;

    // Authentication errors
    if (errorCode.startsWith("auth/")) {
      switch (errorCode) {
        case "auth/email-already-in-use":
          return t("toast.error.auth.emailAlreadyInUse");
        case "auth/invalid-email":
          return t("toast.error.auth.invalidEmail");
        case "auth/weak-password":
          return t("toast.error.auth.weakPassword");
        case "auth/user-not-found":
          return t("toast.error.auth.userNotFound");
        case "auth/wrong-password":
          return t("toast.error.auth.wrongPassword");
        case "auth/too-many-requests":
          return t("toast.error.auth.tooManyRequests");
        case "auth/network-request-failed":
          return t("toast.error.network");
        case "auth/invalid-credential":
          return t("toast.error.auth.invalidCredential");
        default:
          return t("toast.error.auth.generic");
      }
    }

    // Firestore errors
    if (errorCode === "permission-denied") {
      return t("toast.error.permissionDenied");
    }

    if (errorCode === "unavailable" || errorCode === "deadline-exceeded") {
      return t("toast.error.network");
    }

    if (errorCode === "not-found") {
      return t("toast.error.notFound");
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Check for network-related errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection")
    ) {
      return t("toast.error.network");
    }

    // Check for permission errors
    if (message.includes("permission") || message.includes("unauthorized")) {
      return t("toast.error.permissionDenied");
    }

    // Return the error message if it's already user-friendly
    if (message.length < 100) {
      return error.message;
    }
  }

  if (typeof error === "string") {
    return error;
  }

  // Generic fallback
  return t("toast.error.generic");
};
