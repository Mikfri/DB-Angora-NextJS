// src/app/layoutWrapper.tsx
'use client'
import TopNav from "@/components/nav/top/TopNavServer";
import Footer from "@/components/footer/footer";
import "react-toastify/dist/ReactToastify.css";
import PageHeader from "@/components/nav/headerBreadcrumb/Breadcrumbs";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Stier, der skal have fuld bredde
const fullWidthPaths = ['/', '/sale', '/sale/rabbits'];  // Vi kan også definere, hvilke sider der skal IKKE have sidenav
  //const noSideNavPaths = ['/', '/account/profile', '/sale/rabbits/profile'];
  
  const isFullWidth = fullWidthPaths.some(path => pathname === path);
  //const shouldHaveSideNav = !noSideNavPaths.some(path => pathname.startsWith(path));
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* TopNav med fuld bredde */}
      <div className="w-full border-b border-zinc-800/50">
        <div className="w-full px-4 mx-auto">
          <TopNav />
        </div>
      </div>
      
      {/* Hovedindhold med tilpasset maksimal bredde */}
      <main className="flex-grow w-full px-4">
        <div className={`mx-auto ${isFullWidth ? 'max-w-screen-2xl' : 'max-w-screen-xl'}`}>
          <div className="py-4">
            <PageHeader />
          </div>
          
          {children}
        </div>
      </main>
      
      {/* Footer med fuld bredde */}
      <Footer />
    </div>
  );
}