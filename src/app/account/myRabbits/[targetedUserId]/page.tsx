// src/app/account/myRabbits/[targetedUserId]/page.tsx

'use client';

import { useAuthStore } from '@/store/authStore';
import RabbitOwnList from '../rabbitOwnList';
import { hasRole, hasAnyRole, roleGroups } from '@/types/auth';
import { useParams } from 'next/navigation';

export default function TargetedUserRabbitsPage() {
  const params = useParams();
  const targetedUserId = typeof params?.targetedUserId === 'string'
    ? params.targetedUserId
    : Array.isArray(params?.targetedUserId)
      ? params.targetedUserId[0]
      : '';

  const currentUser = useAuthStore(state => state.userIdentity);

  const canViewOthers =
    currentUser &&
    (
      hasRole(currentUser, 'Admin') ||
      hasAnyRole(currentUser, roleGroups.moderators)
    );

  if (!canViewOthers) {
    return <div>Du har ikke adgang til at se andre brugeres kaniner.</div>;
  }

  // RabbitOwnList kan evt. tage userId som prop hvis du ønsker at vise kaniner for en anden bruger
  // Hvis RabbitOwnList kun viser egne kaniner, skal du tilpasse storen til at tage userId som parameter
  return <RabbitOwnList userId={targetedUserId} />;
}