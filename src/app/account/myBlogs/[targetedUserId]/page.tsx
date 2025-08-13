// src/app/account/myBlogs/[targetedUserId]/page.tsx

'use client';

import { useAuthStore } from '@/store/authStore';
import BlogOwnList from '../blogOwnList';
import { hasRole, hasAnyRole, roleGroups } from '@/types/auth';
import { useParams } from 'next/navigation';

export default function TargetedUserBlogsPage() {
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
      hasAnyRole(currentUser, roleGroups.moderators) ||
      hasAnyRole(currentUser, roleGroups.contentCreators)
    );

  if (!canViewOthers) {
    return <div>Du har ikke adgang til at se andre brugeres blogs.</div>;
  }

  return <BlogOwnList userId={targetedUserId} />;
}