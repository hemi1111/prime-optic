import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top when the route (pathname) changes.
 * Use this in a component that is rendered inside the Router (e.g. App or RootLayout).
 */
export function useScrollToTop(delayMs = 0) {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    if (delayMs <= 0) {
      scrollToTop();
      return;
    }

    const timeoutId = window.setTimeout(scrollToTop, delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [pathname, delayMs]);
}
