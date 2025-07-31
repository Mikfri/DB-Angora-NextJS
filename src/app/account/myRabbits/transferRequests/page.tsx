// src/app/account/transferRequests/page.tsx
"use client";

import { useEffect } from "react";
import MyNav from '@/components/nav/side/index/MyNav';
import { useNav } from '@/components/providers/Providers';
import TransferRequestList from './transferRequestList';

export default function TransferRequestsPage() {
  const { setSecondaryNav } = useNav();

  useEffect(() => {
    setSecondaryNav(<MyNav />);
    return () => setSecondaryNav(null);
  }, [setSecondaryNav]);

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <h1 className="text-2xl font-bold mb-6">Overførselsanmodninger</h1>
      <TransferRequestList />
    </div>
  );
}