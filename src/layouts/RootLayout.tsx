import type { ReactNode } from "react";

import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { ToastProvider } from "../components/ui/ToastContainer";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <MobileNav />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">{children}</div>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default RootLayout;
