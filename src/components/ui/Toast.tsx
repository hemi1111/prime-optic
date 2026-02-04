import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastProps = {
  toast: Toast;
  onDismiss: (id: string) => void;
};

const Toast = ({ toast, onDismiss }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.duration, toast.id]);

  const getToastStyles = () => {
    const baseStyles = "rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-[500px] transition-all duration-300";
    
    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isExiting
          ? "opacity-0 translate-y-full"
          : "opacity-100 translate-y-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
