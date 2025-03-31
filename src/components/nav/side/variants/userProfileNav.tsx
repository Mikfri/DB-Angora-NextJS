// src/components/sectionNav/variants/userProfileNav.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionNav from '@/components/sectionNav/base/baseSideNav';

interface Props {
    breederRegNo: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string | null;
}

export default function UserProfileNav({
    breederRegNo,
    firstName,
    lastName,
    email,
    phone,
    profilePicture
}: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/sideNavigationCard_UserProfile.jpg';
    const displayedImage = (!imageError && profilePicture) ? profilePicture : defaultImage;

    return (
        <SectionNav title={`Profil: ${firstName} ${lastName}`}>
            <div className="flex flex-col items-center space-y-4 p-2 text-white">
                {/* Profile Image */}
                <div className="relative w-24 h-24">
                    <Image
                        src={displayedImage}
                        alt={`${firstName} ${lastName} Profile Picture`}
                        fill
                        sizes="96px"
                        className="rounded-full object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>
                
                {/* Profile Information */}
                <div className="w-full space-y-2 text-sm">
                    {breederRegNo && (
                        <div>
                            <div className="text-zinc-400">Avler nummer</div>
                            <div>{breederRegNo}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-zinc-400">Email</div>
                        <div>{email || 'Ikke angivet'}</div>
                    </div>
                    <div>
                        <div className="text-zinc-400">Telefon</div>
                        <div>{phone || 'Ikke angivet'}</div>
                    </div>
                </div>
            </div>
        </SectionNav>
    );
}