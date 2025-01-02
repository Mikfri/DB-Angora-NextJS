// src/app/layoutWrapper.tsx (client component)
'use client'
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
// import { GiRabbit } from "react-icons/gi";
import PageHeader from "@/components/header/pageHeader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TopNav />
      {/* Header row with Logo + Title */}
      <div className="my-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 p-4 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50">
          {/* <GiRabbit size={40} className="text-sky-600" /> */}
          <PageHeader />
        </div>
      </div>
      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex">
          <div className="w-72 flex-shrink-0" /> {/* Sidebar space */}
          <main className="flex-1 pl-12">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer/>
    </Providers>
  );
}