import { Toaster } from "sonner";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-right" richColors duration={4000} />
      <main className="mx-auto px-16 py-4">{children}</main>
    </div>
  );
}
