import { useToastContext } from "../components/ui/ToastContainer";

export const useToast = () => {
  const { showToast } = useToastContext();

  const toast = {
    success: (message: string, duration?: number) => {
      showToast(message, "success", duration);
    },
    error: (message: string, duration?: number) => {
      showToast(message, "error", duration);
    },
    info: (message: string, duration?: number) => {
      showToast(message, "info", duration);
    },
  };

  return toast;
};
