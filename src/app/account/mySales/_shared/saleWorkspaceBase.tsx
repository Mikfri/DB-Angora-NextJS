// src/app/account/mySales/_shared/saleWorkspaceBase.tsx

/**
 * Genbrugelig base-komponent for "salgsarbejdsplads" i brugerens annoncer (Mine Salg).
 * - Indeholder fælles layout og funktionalitet for både kanin- og uldsalgsarbejdspladsen.
 * - Håndterer visning af generelle salgsoplysninger (titel, pris, status, beskrivelse, datoer).
 * - Inkluderer knapper til redigering og sletning af annoncen.
 * - Entity-specifikke felter (f.eks. kaninens øre-comb ID, uldens fiberindhold) injiceres via children-prop.
 * - Målrettet mod private salgsvisninger, da den viser følsomme oplysninger som ID.
 */

'use client';
import { useRouter } from 'next/navigation';
import { Button, Chip, Card, CardBody } from '@heroui/react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { FiArrowLeft, FiEye, FiTruck } from 'react-icons/fi';
import { SaleDetailsPrivateDTO } from '@/api/types/SaleDetailsDTOs';
import { ROUTES } from '@/constants/navigationConstants';

interface SaleWorkspaceBaseProps {
  profile: SaleDetailsPrivateDTO;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  children?: React.ReactNode;  // ← entity-specifikke felter
}

export default function SaleWorkspaceBase({ profile, onEdit, onDelete, isDeleting, children }: SaleWorkspaceBaseProps) {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <Button variant="light" startContent={<FiArrowLeft />} onPress={() => router.push(ROUTES.ACCOUNT.MY_SALES)}>
                Mine annoncer
            </Button>

            <Card className="bg-zinc-800/80 border border-zinc-700/50">
                <CardBody className="space-y-4">
                    {/* Header: titel + pris + status */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.title}</h1>
                            <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1">
                                <span><FiEye className="inline mr-1" />{profile.viewCount} visninger</span>
                                <span>ID: {profile.id}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-2xl font-bold text-amber-500">{formatCurrency(profile.price)}</span>
                            <Chip color={profile.status === 'Active' ? 'success' : 'default'} size="sm">{profile.status}</Chip>
                        </div>
                    </div>

                    {/* Public URL */}
                    <div className="bg-zinc-900/50 p-3 rounded-lg text-sm flex justify-between items-center">
                        <span className="text-zinc-400">Offentlig URL: </span>
                        <a href={ROUTES.SALE.BASE + '/' + profile.slug} target="_blank" className="text-blue-400 hover:underline">
                            .../{profile.slug}
                        </a>
                        {profile.canBeShipped && <Chip startContent={<FiTruck />} size="sm" color="primary">Kan leveres</Chip>}
                    </div>

                    {/* Base datoer */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-zinc-400">Oprettet</p><p>{formatDate(profile.dateListed)}</p></div>
                        <div><p className="text-zinc-400">Sidst opdateret</p><p>{formatDate(profile.lastUpdated)}</p></div>
                    </div>

                    {/* Beskrivelse */}
                    <div>
                        <p className="text-zinc-400 text-sm mb-1">Beskrivelse</p>
                        <div className="bg-zinc-900/50 p-3 rounded-lg whitespace-pre-wrap">{profile.description || 'Ingen beskrivelse'}</div>
                    </div>

                    {/* Entity-specifikke felter injiceres her */}
                    {children}

                    {/* Handlinger */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-700/50">
                        <Button color="danger" variant="flat" onPress={onDelete} isLoading={isDeleting}>Slet</Button>
                        <Button color="primary" onPress={onEdit}>Rediger</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}