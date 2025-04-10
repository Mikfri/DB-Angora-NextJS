// src/components/cloudinary/CloudinaryImage.tsx
'use client';

import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';

type CloudinaryImageProps = {
  publicId: string;
  cloudName?: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string;
  className?: string;
};

export default function CloudinaryImage({
  publicId,
  cloudName,
  alt,
  width,
  height,
  fallbackSrc,
  className
}: CloudinaryImageProps) {
  const [useCloudinary, setUseCloudinary] = useState(false);
  
  // Check if we can use Cloudinary based on environment or provided cloudName
  useEffect(() => {
    const envCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const effectiveCloudName = cloudName || envCloudName;
    setUseCloudinary(!!effectiveCloudName && !!publicId);
  }, [cloudName, publicId]);
  
  // Use regular Image if we can't use Cloudinary
  if (!useCloudinary) {
    return (
      <Image
        src={fallbackSrc || publicId} // Fallback to using publicId as URL if no fallback provided
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: "cover" }}
        unoptimized={true}
      />
    );
  }
  
  // This will only render if we confirmed cloudName is available
  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      crop="fill"
      gravity="auto"
      alt={alt}
      className={className}
    />
  );
}