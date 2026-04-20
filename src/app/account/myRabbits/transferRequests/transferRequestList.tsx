'use client';
import { Chip, Tooltip, Button, Avatar } from '@/components/ui/heroui';
import { ConfirmModal } from '@/components/ui/custom/modals';
import React from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTransferRequests } from "@/hooks/transferRequests/useTransferRequest";
import { TransferRequestPreviewDTO } from "@/api/types/AngoraDTOs";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";
import { RiUserReceivedLine, RiUserSharedLine } from "react-icons/ri";

const baseColumns = [
    { name: "Status", uid: "statusDate", key: "statusDate" },
    { name: "Kanin", uid: "rabbit", key: "rabbit" },
];

const receivedColumns = [
    ...baseColumns,
    { name: "Udsteder (regnr)", uid: "issuer_BreederRegNo", key: "issuer_BreederRegNo" },
    { name: "Udsteder (navn)", uid: "issuer_FirstName", key: "issuer_FirstName" },
    { name: "Pris", uid: "price", key: "price" },
    { name: "Handling", uid: "actions", key: "actions" },
];

const sentColumns = [
    ...baseColumns,
    { name: "Modtager (regnr)", uid: "recipient_BreederRegNo", key: "recipient_BreederRegNo" },
    { name: "Modtager (navn)", uid: "recipient_FirstName", key: "recipient_FirstName" },
    { name: "Pris", uid: "price", key: "price" },
    { name: "Handling", uid: "actions", key: "actions" },
];

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
    Accepted: "success",
    Pending: "warning",
    Rejected: "danger",
};

export default function TransferRequestList() {
    const { received, sent, isLoading, error, load, respond, remove } = useTransferRequests();
    const [tab, setTab] = React.useState<"received" | "sent">("received");
    const [confirm, setConfirm] = React.useState<{ id: number, accept: boolean } | null>(null);

    React.useEffect(() => {
        load();
    }, [load]);

    const list = tab === "received" ? received : sent;
    const columns = tab === "received" ? receivedColumns : sentColumns;

    const handleRespond = React.useCallback(
        async (id: number, accept: boolean) => {
            const result = await respond(id, accept);
            if (result.success) {
                toast.success(result.message);
                load();
            } else {
                toast.error(result.error);
            }
        },
        [respond, load]
    );

    const handleDelete = React.useCallback(
        async (id: number) => {
            const result = await remove(id);
            if (result.success) {
                toast.success("Anmodning annulleret");
                load();
            } else {
                toast.error(result.error);
            }
        },
        [remove, load]
    );

    // Modal handler - skal være udenfor renderCell!
    const handleConfirm = React.useCallback(async () => {
        if (confirm) {
            await handleRespond(confirm.id, confirm.accept);
            setConfirm(null);
        }
    }, [confirm, handleRespond]);

    const renderCell = React.useCallback(
        (item: TransferRequestPreviewDTO, columnKey: string) => {
            const cellValue = item[columnKey as keyof TransferRequestPreviewDTO];
            switch (columnKey) {
                case "statusDate":
                    return (
                        <div className="flex flex-col gap-0.5">
                            <Chip
                                className="capitalize"
                                color={statusColorMap[item.status ?? ""] || "default"}
                                size="sm"
                                variant="soft"
                            >
                                {item.status}
                            </Chip>
                            {item.dateAccepted && (
                                <span className="text-xs text-foreground/50">{formatDate(item.dateAccepted)}</span>
                            )}
                        </div>
                    );
                case "actions":
                    if (tab === "received") {
                        const isPending = item.status === "Pending";
                        return (
                            <div className="flex gap-2 justify-center">
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            aria-label="Acceptér"
                                            size="sm"
                                            variant="secondary"
                                            onPress={() => setConfirm({ id: item.id, accept: true })}
                                            isDisabled={!isPending}
                                        >
                                            <FaCheck />
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>Acceptér</Tooltip.Content>
                                </Tooltip.Root>
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            aria-label="Afvis"
                                            size="sm"
                                            variant="danger"
                                            onPress={() => setConfirm({ id: item.id, accept: false })}
                                            isDisabled={!isPending}
                                        >
                                            <FaTimes />
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>Afvis</Tooltip.Content>
                                </Tooltip.Root>
                            </div>
                        );
                    } else {
                        // "Sent" tab: disable slet hvis ikke Pending
                        const isPending = item.status === "Pending";
                        return (
                            <div className="flex gap-2 justify-center">
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            aria-label="Annullér"
                                            size="sm"
                                            variant="danger"
                                            onPress={() => handleDelete(item.id)}
                                            isDisabled={!isPending}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>Annullér</Tooltip.Content>
                                </Tooltip.Root>
                            </div>
                        );
                    }
                case "rabbit": {
                    const name = item.rabbit_NickName ?? null;
                    const initials = name ? name.charAt(0).toUpperCase() : '?';
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar size="sm">
                                {item.rabbit_ProfilePhotoUrl && (
                                    <Avatar.Image
                                        src={item.rabbit_ProfilePhotoUrl}
                                        alt={name ?? 'Kanin'}
                                        loading="lazy"
                                    />
                                )}
                                <Avatar.Fallback>{initials}</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm text-foreground">{name ?? <span className="text-foreground/40 italic">Ukendt</span>}</span>
                                <span className="text-xs text-foreground/50">{item.rabbit_EarCombId ?? '-'}</span>
                            </div>
                        </div>
                    );
                }
                case "price":
                    return item.price != null
                        ? <span>{formatCurrency(item.price)}</span>
                        : <span className="text-foreground/40 italic">-</span>;

                default:
                    return cellValue ?? <span className="text-foreground/40 italic">-</span>;
            }
        },
        [tab, handleDelete]
    );

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Button
                    size="sm"
                    variant={tab === "received" ? "primary" : "ghost"}
                    onPress={() => setTab("received")}
                >
                    <RiUserReceivedLine className="text-large" /> Modtaget
                </Button>
                <Button
                    size="sm"
                    variant={tab === "sent" ? "primary" : "ghost"}
                    onPress={() => setTab("sent")}
                >
                    <RiUserSharedLine className="text-large" /> Sendt
                </Button>
            </div>
            {isLoading && <div className="py-8"><span>Indlæser...</span></div>}
            {error && <div className="text-danger">{error}</div>}
            {!isLoading && !error && (
                <div className="unified-container overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-foreground">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className={`${column.uid === "actions" ? "text-center" : "text-left"} px-3 py-2 text-xs font-medium text-foreground/60`}>
                                        {column.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item) => (
                                <tr key={item.id} className="border-t border-foreground/10">
                                    {columns.map((column) => (
                                        <td key={column.key} className={`${column.uid === "actions" ? "px-3 py-1.5 text-center" : "px-3 py-1.5"} text-sm text-foreground`}>
                                            {renderCell(item, column.uid)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}
            {!isLoading && !error && list.length === 0 && (
                <div className="text-foreground/50 mt-4">Ingen anmodninger fundet.</div>
            )}

            <ConfirmModal
                isOpen={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleConfirm}
                title="Bekræft handling"
                status={confirm?.accept ? 'accent' : 'danger'}
                confirmLabel={confirm?.accept ? 'Acceptér' : 'Afvis'}
            >
                Er du sikker på, at du vil {confirm?.accept ? 'acceptere' : 'afvise'} denne anmodning?
            </ConfirmModal>
        </div>
    );
}
