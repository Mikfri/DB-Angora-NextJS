// src/app/account/myBlogs/page.tsx

'use client';

import { useAuthStore } from '@/store/authStore';
import BlogOwnList from './blogOwnList';

export default function MyBlogsPage() {
  const user = useAuthStore(state => state.userIdentity);
  if (!user) return <div>Du skal være logget ind for at se dine blogs.</div>;
  return <BlogOwnList userId={user.id} />;
}