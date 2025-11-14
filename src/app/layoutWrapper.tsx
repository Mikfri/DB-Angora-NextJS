// src/app/layoutWrapper.tsx
'use client'
import TopNav from "@/components/nav/top/TopNav";
import Footer from "@/components/footer/footer";
import PageHeader from "@/components/nav/headerBreadcrumb/Breadcrumbs";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Stier, hvor pageHeader ikke skal vises
  const hideHeaderPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    // Tilføj andre sider uden header her
  ];

  const shouldShowHeader = !hideHeaderPaths.some(path => pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopNav wrapper - border flyttet ind i container så den flugter med content */}
      <div className="w-full">
        <div className="mx-auto max-w-screen-2xl w-full px-4 border-b border-zinc-800/50">
          <TopNav />
        </div>
      </div>

      {/* Hovedindhold - altid fuld bredde */}
      <main className="flex-grow w-full px-4">
        <div className="mx-auto max-w-screen-2xl">
          {shouldShowHeader && (
            <div className="py-4 bg-white dark:bg-zinc-900 transition-colors rounded-xl shadow-sm">
              <PageHeader />
            </div>
          )}

          {children}
        </div>
      </main>

      {/* Footer med fuld bredde */}
      <Footer />
    </div>
  );
}