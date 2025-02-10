// src/app/layoutWrapper.tsx (client component)
'use client'
import { useNav } from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import Footer from "@/components/footer/footer";
import MyNav from "@/components/sectionNav/variants/myNav";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PageHeader from "@/components/header/pageHeader";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { primaryNav, secondaryNav } = useNav();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      {/* Breadcrumbs section */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 py-4">
          <div className="p-4 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border-b-2 border-zinc-800/50">
            <PageHeader />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Main content with sticky sidebars */}
        <div className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-6">
              {/* Sidebar column - always present */}
              <div className="w-[280px] flex-shrink-0 flex flex-col gap-6">
                <div className="sticky top-6">
                  {primaryNav || <MyNav />}
                  {secondaryNav && (
                    <div className="mt-6">
                      {secondaryNav}
                    </div>
                  )}
                </div>
              </div>

              {/* Main content column */}
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer position="bottom-center" />
    </div>
  );
}