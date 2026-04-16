// src/components/nav/side/MySalesNavClient.tsx
'use client';

import { Button, Separator, Input } from '@/components/ui/heroui';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/navigationConstants';
import { useSalesOwnedStore, SaleStatusFilter } from '@/store/salesOwnedStore';
import { FiArrowLeft } from 'react-icons/fi';
import { RiAddCircleLine } from 'react-icons/ri';
import { MdOutlineSearch } from 'react-icons/md';

const STATUS_TABS: { key: SaleStatusFilter; label: string }[] = [
    { key: 'all',     label: 'Alle' },
    { key: 'Active',  label: 'Aktive' },
    { key: 'OnHold',  label: 'Inaktive' },
    { key: 'Sold',    label: 'Solgte' },
];

export function MySalesNavClient() {
    const router = useRouter();
    const { statusFilter, search, setStatusFilter, setSearch, items } = useSalesOwnedStore();

    const countFor = (key: SaleStatusFilter) =>
        key === 'all' ? items.length : items.filter((i) => i.status === key).length;

    return (
        <div className="w-full p-1 space-y-2">
            {/* Tilbage */}
            <button
                onClick={() => router.push(ROUTES.ACCOUNT.BASE)}
                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
                <FiArrowLeft className="shrink-0" />
                Min side
            </button>

            <Separator className="divider my-0.5" />

            {/* Handlinger */}
            <div>
                <h3 className="text-label mb-0.5">Handlinger</h3>
                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    className="justify-start"
                    onPress={() => router.push(ROUTES.ACCOUNT.MY_RABBITS)}
                >
                    <RiAddCircleLine className="text-lg" /> Opret ny annonce
                </Button>
            </div>

            <Separator className="divider my-0.5" />

            {/* Søg */}
            <div>
                <h3 className="text-label mb-0.5">Søg</h3>
                <div className="flex items-center gap-1">
                    <MdOutlineSearch className="text-lg text-muted shrink-0" />
                    <div className="flex-1">
                        <Input
                            placeholder="Titel eller type"
                            aria-label="Søg annonce"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Separator className="divider my-0.5" />

            {/* Status filter */}
            <div>
                <h3 className="text-label mb-1">Status</h3>
                <div className="space-y-1">
                    {STATUS_TABS.map(({ key, label }) => {
                        const count = countFor(key);
                        const isActive = statusFilter === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setStatusFilter(key)}
                                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-foreground/70 hover:bg-surface hover:text-foreground'
                                }`}
                            >
                                <span>{label}</span>
                                {count > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/20 text-primary' : 'bg-surface-secondary text-muted'}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
