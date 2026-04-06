// src/components/ui/AutoSaveIndicator.tsx
'use client';

import { Chip, Spinner } from '@heroui/react';
import { FaCheck, FaExclamationTriangle, FaCloud } from 'react-icons/fa';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
}

export function AutoSaveIndicator({ status, lastSaved }: AutoSaveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  };

  if (status === 'saving') {
    return (
      <Chip variant="flat" color="warning" size="sm" startContent={<Spinner size="sm" color="warning" />}>
        Gemmer...
      </Chip>
    );
  }

  if (status === 'saved') {
    return (
      <Chip variant="flat" color="success" size="sm" startContent={<FaCheck className="w-3 h-3" />}>
        Gemt {lastSaved && `kl. ${formatTime(lastSaved)}`}
      </Chip>
    );
  }

  if (status === 'error') {
    return (
      <Chip variant="flat" color="danger" size="sm" startContent={<FaExclamationTriangle className="w-3 h-3" />}>
        Fejl ved gem
      </Chip>
    );
  }

  if (lastSaved) {
    return (
      <Chip variant="flat" color="default" size="sm" startContent={<FaCloud className="w-3 h-3" />}>
        Sidst gemt {formatTime(lastSaved)}
      </Chip>
    );
  }

  return null;
}