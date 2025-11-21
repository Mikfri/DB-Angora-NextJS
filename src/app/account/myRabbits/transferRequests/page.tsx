// src/app/account/transferRequests/page.tsx
"use client";

import TransferRequestList from './transferRequestList';

export default function TransferRequestsPage() {
  return (
    <div className="content-cell">
      <h1 className="text-2xl font-bold mb-6">Overførselsanmodninger</h1>
      <TransferRequestList />
    </div>
  );
}