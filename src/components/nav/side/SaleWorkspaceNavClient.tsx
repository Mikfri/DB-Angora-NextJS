// src/components/nav/side/SaleWorkspaceNavClient.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiEye, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { Separator, Spinner, Button } from '@/components/ui/heroui';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/navigationConstants';

const STATUS_LABEL: Record<string, string> = {
    Active: 'Aktiv',
    OnHold: 'Inaktiv',
    Sold: 'Solgt',
};

const STATUS_SELECTED: Record<string, string> = {
    Active: 'bg-success text-white',
    OnHold: 'bg-warning text-white',
    Sold: 'bg-danger text-white',
};

const STATUSES = ['Active', 'OnHold', 'Sold'] as const;

const ENTITY_TYPE_LABEL: Record<string, string> = {
    Rabbit: 'Kanin',
    Yarn: 'Garn',
    WoolRaw: 'Rå uld',
    WoolCarded: 'Kartet uld',
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-1.5">
            <span className="text-label shrink-0 mr-2">{label}</span>
            <span className="text-value text-right">{children}</span>
        </div>
    );
}

export function SaleWorkspaceNavClient() {
    const router = useRouter();
    const { profile, isLoading, error, isDeleting, handleDelete, isStatusUpdating, handleStatusUpdate } = useSaleWorkspace();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="w-full p-1 space-y-3">
            {/* Tilbage-knap */}
            <button
                onClick={() => router.push(ROUTES.ACCOUNT.MY_SALES)}
                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
                <FiArrowLeft className="shrink-0" />
                Mine annoncer
            </button>

            <Separator />

            {isLoading && (
                <div className="flex justify-center py-6">
                    <Spinner size="sm" />
                </div>
            )}

            {error && (
                <p className="text-xs text-danger px-1">{error}</p>
            )}

            {profile && (
                <>
                    {/* Handlinger */}
                    <div>
                        <h3 className="text-label mb-1">Handlinger</h3>
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex flex-col gap-0.5 mb-2">
                                <span className="text-label">Status</span>
                                <div className="flex gap-1">
                                    {STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => profile.status !== s && handleStatusUpdate(s)}
                                            disabled={isStatusUpdating}
                                            className={`flex-1 text-xs px-1 py-1.5 rounded-md font-medium transition-colors ${profile.status === s
                                                    ? STATUS_SELECTED[s]
                                                    : 'border border-divider text-foreground/60 hover:text-foreground hover:bg-surface-secondary'
                                                }`}
                                        >
                                            {STATUS_LABEL[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!showDeleteConfirm ? (
                                <Button
                                    variant="danger-soft"
                                    fullWidth
                                    size="sm"
                                    onPress={() => setShowDeleteConfirm(true)}
                                >
                                    <FaTrash /> Slet annonce
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs text-danger">Er du sikker? Dette kan ikke fortrydes.</p>
                                    <div className="flex gap-1.5">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="flex-1"
                                            onPress={handleDelete}
                                            isPending={isDeleting}
                                        >
                                            Ja, slet
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1"
                                            onPress={() => setShowDeleteConfirm(false)}
                                            isDisabled={isDeleting}
                                        >
                                            Annuller
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Separator />
                    </div>

                    {/* Profilbillede */}
                    {profile.profilePhotoUrl && (
                        <div className="rounded-lg overflow-hidden aspect-video w-full bg-surface-muted">
                            <img
                                src={profile.profilePhotoUrl}
                                alt={profile.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Titel + pris */}
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                            {profile.title}
                        </p>
                        <span className="text-sm font-medium text-foreground/70">
                            {formatCurrency(profile.price)}
                        </span>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="divide-y divide-divider">
                        <Row label="Oprettet">
                            <span className="flex items-center gap-1">
                                <FiCalendar className="text-foreground/50 shrink-0" size={12} />
                                {formatDate(profile.dateListed)}
                            </span>
                        </Row>
                        <Row label="Sidst opdateret">
                            {formatDate(profile.lastUpdated)}
                        </Row>
                        <Row label="Visninger">
                            <span className="flex items-center gap-1">
                                <FiEye className="text-foreground/50 shrink-0" size={12} />
                                {profile.viewCount}
                            </span>
                        </Row>
                    </div>

                    <Separator />

                    {/* Offentlig annonce-link */}
                    <a
                        href={`${ROUTES.SALE.BASE}/${profile.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                        <FiExternalLink className="shrink-0" size={12} />
                        Vis offentlig annonce
                    </a>
                </>
            )}
        </div>
    );
}
