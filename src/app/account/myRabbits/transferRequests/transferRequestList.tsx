'use client';
import { Modal, Chip, Tooltip, Button } from '@/components/ui/heroui';
import React from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTransferRequests } from "@/hooks/transferRequests/useTransferRequest";
import { TransferRequestPreviewDTO } from "@/api/types/AngoraDTOs";
import { toast } from "react-toastify";
import { RiUserReceivedLine, RiUserSharedLine } from "react-icons/ri";

const baseColumns = [
    { name: "Status", uid: "status", key: "status" },
    { name: "Navn", uid: "rabbit_NickName", key: "rabbit_NickName" },
    { name: "Øremærke", uid: "rabbit_EarCombId", key: "rabbit_EarCombId" },
];

const receivedColumns = [
    ...baseColumns,
    { name: "Udsteder (regnr)", uid: "issuer_BreederRegNo", key: "issuer_BreederRegNo" },
    { name: "Udsteder (navn)", uid: "issuer_FirstName", key: "issuer_FirstName" },
    { name: "Handling", uid: "actions", key: "actions" },
];

const sentColumns = [
    ...baseColumns,
    { name: "Modtager (regnr)", uid: "recipient_BreederRegNo", key: "recipient_BreederRegNo" },
    { name: "Modtager (navn)", uid: "recipient_FirstName", key: "recipient_FirstName" },
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
                case "status":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[item.status ?? ""] || "default"}
                            size="sm"
                            variant="soft"
                        >
                            {cellValue}
                        </Chip>
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
                default:
                    return cellValue ?? <span className="text-zinc-500 italic">-</span>;
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
            {error && <div className="text-red-400">{error}</div>}
            {!isLoading && !error && (
                <div className="overflow-hidden rounded-lg bg-zinc-900 text-zinc-100">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-zinc-100">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className={`${column.uid === "actions" ? "text-center" : "text-left"} px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400`}>
                                        {column.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item) => (
                                <tr key={item.id} className="border-t border-zinc-800">
                                    {columns.map((column) => (
                                        <td key={column.key} className={`${column.uid === "actions" ? "px-4 py-3 text-center" : "px-4 py-3"} text-sm leading-6`}>
                                            {renderCell(item, column.uid)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!isLoading && !error && list.length === 0 && (
                <div className="text-zinc-400 mt-4">Ingen anmodninger fundet.</div>
            )}

            {/* Modal kun mounted når confirm er sat */}
            {!!confirm && <Modal isOpen={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null); }}>
                <Modal.Backdrop />
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>Bekræft handling</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            Er du sikker på, at du vil {confirm?.accept ? "acceptere" : "afvise"} denne anmodning?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onPress={() => setConfirm(null)}>
                                Annuller
                            </Button>
                            <Button variant={confirm?.accept ? "secondary" : "danger"} onPress={handleConfirm}>
                                Bekræft
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal>}
        </div>
    );
}
