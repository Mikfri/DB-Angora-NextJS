// src/app/account/profile/[userProfileId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@heroui/react';
import { useParams } from 'next/navigation';
import { getUserProfile } from '@/app/actions/account/accountActions';
import UserProfile from './userProfile';

export default function UserProfilePage() {
  const params = useParams();
  const userProfileId = params.userProfileId as string;

  const [result, setResult] = useState<Awaited<ReturnType<typeof getUserProfile>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getUserProfile(userProfileId)
      .then((res) => {
        if (isMounted) setResult(res);
      })
      .catch(() => {
        if (isMounted) setError('Kunne ikke hente brugerprofil');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userProfileId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error || !result?.success || !result.data) {
    return <div className="text-center text-red-400 mt-10">Brugerprofil ikke fundet eller fejl opstod.</div>;
  }

  return <UserProfile userProfile={result.data} />;
}