// src/components/cards/rabbitPedigreeCard.tsx
'use client';

import { useState } from 'react';
import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import Image from 'next/image';
import { IoColorPaletteOutline } from "react-icons/io5";
import { LuRabbit } from "react-icons/lu";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { MdOutlineDateRange } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Props {
  rabbit: Rabbit_PedigreeDTO;
}

export default function RabbitPedigreeCard({ rabbit }: Props) {
  const {
    EarCombId,
    NickName,
    Gender,
    DateOfBirth,
    Race,
    Color,
    UserOriginName,
    UserOwnerName,
    ProfilePicture,
    InbreedingCoefficient,
    // Generation
    Relation,
  } = rabbit;

  const [open, setOpen] = useState(false);

  const displayNameFull = NickName || 'Unavngivet';

  // Vis maks 7 tegn i kortet, men behold fuldt navn i tooltip/title
  const truncate = (s: string, n = 7) => s.length > n ? `${s.slice(0, n)}…` : s;
  const displayName = truncate(displayNameFull, 7);
  const profileImage = ProfilePicture || '/images/default-rabbit.jpg';

  const genderIcon = Gender && Gender.toLowerCase().includes('han')
    ? <BsGenderMale className="text-blue-400" size={14} aria-label="han" />
    : Gender && Gender.toLowerCase().includes('hun')
      ? <BsGenderFemale className="text-pink-400" size={14} aria-label="hun" />
      : <LuRabbit className="text-zinc-400" size={14} aria-label="ukendt" />;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 overflow-hidden min-h-[80px]">
      <div className="flex items-start gap-2 px-3 py-1.5">
        {/* Venstre: billede + ear id + nickname (hver sin række) */}
        <div className="flex items-start gap-1 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-700 flex-shrink-0">
            <Image
              src={profileImage}
              alt={`${displayNameFull} profilbillede`}
              fill
              className="object-cover"
              sizes="40px"
              draggable={false}
            />
          </div>

          <div className="min-w-0">
            {/* EarCombId på egen linje, venstrejusteret */}
            <div className="text-xs text-zinc-300 truncate mb-0.5 text-left">{EarCombId}</div>

            {/* NickName på næste linje */}
            <div className="flex items-center gap-1">
              <span
                className="font-semibold text-zinc-100 text-sm truncate max-w-[140px]"
                title={displayNameFull}
              >
                {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Højre: gender icon + accordion toggle (gender flyttet til højre) */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center">
            {/* Gender icon on right */}
            <span className="mr-1">{genderIcon}</span>
          </div>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
            className="p-1 rounded hover:bg-zinc-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={open ? 'Skjul detaljer' : 'Vis detaljer'}
          >
            {open ? <FiChevronUp className="text-zinc-300" /> : <FiChevronDown className="text-zinc-300" />}
          </button>
        </div>
      </div>

      {/* Nedre linje (altid synlig) - Race + Color i lodret layout */}
      <div className="px-3 pt-0.5 pb-1 text-xs text-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1 text-zinc-400">
              <LuRabbit className="mt-0.5" />
              <span className="text-[12px]">{Race || '-'}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <IoColorPaletteOutline className="mt-0.5" />
              <span className="text-[12px]">{Color || '-'}</span>
            </div>
          </div>

          <div className="text-right text-xs text-zinc-300">
            <div className="text-[11px] text-zinc-400">Indavl</div>
            <div className="text-sm font-semibold text-blue-400">
              {InbreedingCoefficient !== null ? `${(InbreedingCoefficient * 100).toFixed(2)}%` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion indhold - relation + detaljer, left aligned */}
      {open && (
        <div className="border-t border-zinc-700/50 px-3 py-2 text-xs text-zinc-300">
          <div className="mb-2">
            <span className="text-zinc-400 text-[11px]">Relation</span>
            <div className="inline-block ml-2 text-[11px] text-zinc-200 bg-zinc-700/50 rounded px-2 py-0.5">{Relation || '-'}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MdOutlineDateRange className="text-zinc-400 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-zinc-400 text-[11px]">Fødselsdato</div>
                <div className="text-zinc-200">{DateOfBirth ? new Date(DateOfBirth).toLocaleDateString('da-DK') : '-'}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <IoColorPaletteOutline className="text-zinc-400 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-zinc-400 text-[11px]">Farve</div>
                <div className="text-zinc-200">{Color || '-'}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2">
              <HiUser className="text-zinc-500 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-zinc-400 text-[11px]">Opdrætter</div>
                <div className="text-zinc-200">{UserOriginName || '-'}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HiUserGroup className="text-zinc-500 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-zinc-400 text-[11px]">Ejer</div>
                <div className="text-zinc-200">{UserOwnerName || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}