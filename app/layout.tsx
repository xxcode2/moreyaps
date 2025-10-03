import type { Metadata } from "next";
import "./globals.css";

import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTabbar from "@/components/MobileTabbar";

export const metadata: Metadata = {
  title: "YapTasks",
  description: "Promote on X (Twitter) with tasks & points",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grid text-slate-100">
        <Providers>
          {/* Mobile top bar */}
          <MobileNav />

          <div className="mx-auto max-w-6xl">
            <div className="flex">
              {/* Sidebar hanya di md+ */}
              <Sidebar />

              {/* Main content (beri padding bawah untuk tabbar mobile) */}
              <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
                {children}
              </main>
            </div>
          </div>

          {/* Bottom tabbar mobile */}
          <MobileTabbar />
        </Providers>
      </body>
    </html>
  );
}
