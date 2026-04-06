// src/app/account/profile/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { userIdentity, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn || !userIdentity?.id) {
      return;
    }
    
    router.push(`/account/profile/${userIdentity.id}`);
  }, [isLoggedIn, userIdentity, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-zinc-400">Omdirigerer...</div>
    </div>
  );
}