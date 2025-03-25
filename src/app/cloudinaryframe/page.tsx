// src/app/cloudinaryframe/page.tsx
'use client';

import { Suspense } from 'react';
import CloudinaryFrame from '@/components/cloudinary/CloudinaryFrame';

// Fjern import af useSearchParams her, da vi flytter den til en underkomponent

function CloudinaryFrameContent() {
  return (
    <div className="cloudinary-frame-page h-full min-h-screen bg-black">
      <CloudinaryFrame />
    </div>
  );
}

export default function CloudinaryFramePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Indlæser...</div>}>
      <CloudinaryFrameContent />
    </Suspense>
  );
}