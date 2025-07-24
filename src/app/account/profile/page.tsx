// src/app/account/profile/page.tsx
import { redirect } from 'next/navigation';
import { getUserIdentity } from '@/app/actions/auth/session';

export default async function ProfileRedirectPage() {
  // Brug getUserIdentity i stedet for direkte cookie access
  const userIdentity = await getUserIdentity();
  
  if (!userIdentity?.id) {
    redirect('/auth/login'); // Eller hvor login siden er
  }
  
  // Redirect til egen profil
  redirect(`/account/profile/${userIdentity.id}`);
}