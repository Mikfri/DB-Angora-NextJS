// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitChildren.tsx
'use client';
import { Rabbit_ProfileDTO, Rabbit_ChildPreviewDTO } from "@/api/types/AngoraDTOs";
import RabbitChildPreviewCard from '@/components/cards/rabbitChildPreviewCard';
import { formatDate } from '@/utils/formatters';
import { useMemo } from 'react';

interface RabbitChildrenProps {
  children: Rabbit_ProfileDTO["children"];
}

// Interface til grupperede børn
interface LitterGroup {
  dateOfBirth: string | null;
  formattedDate: string;
  children: Rabbit_ChildPreviewDTO[];
  otherParentId: string | null;
}

export default function RabbitChildren({ children = [] }: RabbitChildrenProps) {
  const isEmpty = !children || children.length === 0;

  // Gruppér børnene efter deres fødselsdato og anden forælder
  const litterGroups = useMemo(() => {
    if (isEmpty) return [];

    // Opret et map af grupper baseret på fødselsdato og anden forælder
    const groups = new Map<string, LitterGroup>();

    // Sortér børnene efter fødselsdato (nyeste først)
    const sortedChildren = [...children].sort((a, b) => {
      if (!a.dateOfBirth) return 1;
      if (!b.dateOfBirth) return -1;
      return new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime();
    });

    // Gruppér børnene
    sortedChildren.forEach(child => {
      const birthDate = child.dateOfBirth || 'unknown';
      const otherParent = child.otherParentId || 'unknown';
      // Lav en unik nøgle for hver kombination af dato og anden forælder
      const key = `${birthDate}-${otherParent}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          dateOfBirth: child.dateOfBirth,
          formattedDate: formatDate(child.dateOfBirth) || 'Ukendt fødselsdato',
          children: [],
          otherParentId: child.otherParentId
        });
      }
      
      groups.get(key)?.children.push(child);
    });

    // Konvertér map til array for lettere rendering
    return Array.from(groups.values());
  }, [children, isEmpty]);

  if (isEmpty) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 p-6 text-center">
        <p className="text-zinc-400">Ingen afkom registreret</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {litterGroups.map((group, index) => (
        <div key={`litter-${group.dateOfBirth || 'unknown'}-${index}`} className="space-y-3">
          {/* Kuld overskrift */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-zinc-100">
              Kuld fra {group.formattedDate}
              {group.children.length > 0 && (
                <span className="ml-2 text-sm text-zinc-400">
                  ({group.children.length} {group.children.length === 1 ? 'unge' : 'unger'})
                </span>
              )}
            </h3>
            
            {group.otherParentId && (
              <div className="flex items-center">
                <span className="text-sm text-zinc-400 mr-2">Anden forælder:</span>
                <a 
                  href={`/account/myRabbits/rabbitProfile/${group.otherParentId}`}
                  className="text-sm font-mono text-blue-400 hover:underline"
                >
                  {group.otherParentId}
                </a>
              </div>
            )}
          </div>
          
          {/* Grid med kaniner i kuldet */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {group.children.map(child => (
              <RabbitChildPreviewCard 
                key={child.earCombId} 
                child={child} 
                compact={true} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}