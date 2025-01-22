// src/app/layoutWrapper.tsx (client component)
'use client'
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import PageHeader from "@/components/header/pageHeader";
import Footer from "@/components/footer/footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="my-6 px-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50">
            <PageHeader />
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto px-4 overflow-hidden w-full">
          <div className="grid grid-cols-[minmax(280px,_280px)_minmax(0,_1fr)] gap-6">
            {children}
          </div>
        </div>
        <Footer />
        <ToastContainer position="bottom-center" />
      </div>
    </Providers>
  );
}