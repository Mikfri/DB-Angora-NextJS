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
  isSelected?: boolean;
  repeatColorIndex?: number;
}

const REPEAT_COLORS = [
  { ring: 'ring-1 ring-amber-400/70',   bg: 'bg-amber-500/8' },
  { ring: 'ring-1 ring-violet-400/70',  bg: 'bg-violet-500/8' },
  { ring: 'ring-1 ring-teal-400/70',    bg: 'bg-teal-500/8' },
  { ring: 'ring-1 ring-rose-400/70',    bg: 'bg-rose-500/8' },
  { ring: 'ring-1 ring-emerald-400/70', bg: 'bg-emerald-500/8' },
  { ring: 'ring-1 ring-orange-400/70',  bg: 'bg-orange-500/8' },
] as const;

export default function RabbitPedigreeCard({ rabbit, isSelected = false, repeatColorIndex }: Props) {
  const {
    EarCombId,
    NickName,
    Gender,
    DateOfBirth,
    Race,
    Color,
    UserOriginName,
    UserOwnerName,
    ProfilePhotoUrl,
    InbreedingCoefficient,
    Relation,
  } = rabbit;

  const [open, setOpen] = useState(false);

  const displayNameFull = NickName || 'Unavngivet';
  const truncate = (s: string, n = 7) => s.length > n ? `${s.slice(0, n)}…` : s;
  const displayName = truncate(displayNameFull, 7);
  const profileImage = ProfilePhotoUrl || '/images/default-rabbit.jpg';

  const isHun = !!Gender?.toLowerCase().includes('hun');

  const genderIcon = !isHun && Gender?.toLowerCase().includes('han')
    ? <BsGenderMale className="text-blue-400" size={14} aria-label="han" />
    : isHun
      ? <BsGenderFemale className="text-pink-400" size={14} aria-label="hun" />
      : <LuRabbit className="text-foreground/50" size={14} aria-label="ukendt" />;

  const repeatColor = repeatColorIndex !== undefined ? REPEAT_COLORS[repeatColorIndex % REPEAT_COLORS.length] : null;

  const ringClass = isSelected
    ? isHun ? 'ring-2 ring-pink-400/70' : 'ring-2 ring-blue-400/70'
    : repeatColor?.ring ?? '';
  const selectedBg = isSelected
    ? isHun ? 'bg-pink-500/5' : 'bg-blue-500/5'
    : repeatColor?.bg ?? '';

  return (
    <div
      className={`rounded-lg border overflow-hidden min-h-20 transition-all duration-150
        border-border bg-surface
        ${ringClass} ${selectedBg}
        ${!isSelected && repeatColor === null ? 'hover:border-(--accent)/30 hover:shadow-(--shadow-hover)' : ''}
      `}
    >
      <div className="flex items-start gap-2 px-3 py-1.5">
        {/* Venstre: billede + ear id + nickname */}
        <div className="flex items-start gap-1 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-surface-secondary shrink-0">
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
            <div className="text-xs text-foreground/55 truncate mb-0.5 text-left">{EarCombId}</div>
            <div className="flex items-center gap-1">
              <span
                className="font-semibold text-foreground text-sm truncate max-w-35"
                title={displayNameFull}
              >
                {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Højre: gender icon + accordion toggle */}
        <div className="ml-auto flex items-center gap-3">
          <span>{genderIcon}</span>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
            className="p-1 rounded hover:bg-(--surface-muted) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            title={open ? 'Skjul detaljer' : 'Vis detaljer'}
          >
            {open
              ? <FiChevronUp className="text-foreground/60" />
              : <FiChevronDown className="text-foreground/60" />
            }
          </button>
        </div>
      </div>

      {/* Race + Color + Indavl */}
      <div className="px-3 pt-0.5 pb-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1 text-foreground/55">
              <LuRabbit className="mt-0.5" />
              <span className="text-[12px]">{Race || '-'}</span>
            </div>
            <div className="flex items-center gap-1 text-foreground/55">
              <IoColorPaletteOutline className="mt-0.5" />
              <span className="text-[12px]">{Color || '-'}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-foreground/45">Indavl</div>
            <div className="text-[12px] text-foreground/55">
              {InbreedingCoefficient !== null ? `${(InbreedingCoefficient * 100).toFixed(2)}%` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion */}
      {open && (
        <div className="border-t border-border px-3 py-2 text-xs text-foreground/70">
          <div className="mb-2">
            <span className="text-foreground/45 text-[11px]">Relation</span>
            <div className="inline-block ml-2 text-[11px] text-foreground/80 bg-(--surface-muted) rounded px-2 py-0.5">
              {Relation || '-'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MdOutlineDateRange className="text-foreground/45 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-foreground/45 text-[11px]">Fødselsdato</div>
                <div className="text-foreground/80">{DateOfBirth ? new Date(DateOfBirth).toLocaleDateString('da-DK') : '-'}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <IoColorPaletteOutline className="text-foreground/45 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-foreground/45 text-[11px]">Farve</div>
                <div className="text-foreground/80">{Color || '-'}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2">
              <HiUser className="text-foreground/40 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-foreground/45 text-[11px]">Opdrætter</div>
                <div className="text-foreground/80">{UserOriginName || '-'}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HiUserGroup className="text-foreground/40 mt-0.5" size={14} />
              <div className="text-left">
                <div className="text-foreground/45 text-[11px]">Ejer</div>
                <div className="text-foreground/80">{UserOwnerName || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
